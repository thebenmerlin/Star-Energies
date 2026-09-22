WITH prepared AS (
  SELECT
    "id",
    CASE
      WHEN "draft_content" ? 'whyStar' THEN "draft_content"
      ELSE "draft_content" || jsonb_build_object(
        'whyStar',
        jsonb_build_object(
          'label', 'Why Star Energies / 02',
          'heading', jsonb_build_array(
            jsonb_build_object('text', 'A coal source should', 'breakAfter', true),
            jsonb_build_object('text', 'fit the job.', 'emphasis', true)
          ),
          'body', 'The strongest supply conversation brings the material, route and delivery plan into focus around the way your operation actually works.',
          'reasons', jsonb_build_array(
            jsonb_build_object('id', 'requirement-first', 'signal', 'THE STARTING POINT', 'title', 'Requirement before route', 'description', 'Grade/GCV, size, volume, frequency, destination and application frame the sourcing conversation from the outset.'),
            jsonb_build_object('id', 'source-options', 'signal', 'THE MARKET VIEW', 'title', 'Routes considered to fit', 'description', 'WCL, auction / e-auction, trader and supplier routes can be assessed against the brief and availability at the time.'),
            jsonb_build_object('id', 'specification-context', 'signal', 'THE MATERIAL FIT', 'title', 'Specifications in view', 'description', 'Relevant material parameters and available reports are clarified against the intended industrial application.'),
            jsonb_build_object('id', 'stocking-base', 'signal', 'THE PHYSICAL BASE', 'title', 'A Wani stocking facility', 'description', 'A practical operating point in the coal belt gives the business a physical base close to the work.'),
            jsonb_build_object('id', 'industry-experience', 'signal', 'THE PERSPECTIVE', 'title', 'Industry-earned understanding', 'description', 'Star Energies is a new business backed by approximately 25 years of coal-industry experience.'),
            jsonb_build_object('id', 'supply-coordination', 'signal', 'THE HANDOVER', 'title', 'Commercials and logistics together', 'description', 'The commercial route and third-party delivery coordination are considered together before dispatch is aligned.')
          )
        )
      )
    END AS "draft_base",
    CASE
      WHEN "published_content" ? 'whyStar' THEN "published_content"
      ELSE "published_content" || jsonb_build_object(
        'whyStar',
        jsonb_build_object(
          'label', 'Why Star Energies / 02',
          'heading', jsonb_build_array(
            jsonb_build_object('text', 'A coal source should', 'breakAfter', true),
            jsonb_build_object('text', 'fit the job.', 'emphasis', true)
          ),
          'body', 'The strongest supply conversation brings the material, route and delivery plan into focus around the way your operation actually works.',
          'reasons', jsonb_build_array(
            jsonb_build_object('id', 'requirement-first', 'signal', 'THE STARTING POINT', 'title', 'Requirement before route', 'description', 'Grade/GCV, size, volume, frequency, destination and application frame the sourcing conversation from the outset.'),
            jsonb_build_object('id', 'source-options', 'signal', 'THE MARKET VIEW', 'title', 'Routes considered to fit', 'description', 'WCL, auction / e-auction, trader and supplier routes can be assessed against the brief and availability at the time.'),
            jsonb_build_object('id', 'specification-context', 'signal', 'THE MATERIAL FIT', 'title', 'Specifications in view', 'description', 'Relevant material parameters and available reports are clarified against the intended industrial application.'),
            jsonb_build_object('id', 'stocking-base', 'signal', 'THE PHYSICAL BASE', 'title', 'A Wani stocking facility', 'description', 'A practical operating point in the coal belt gives the business a physical base close to the work.'),
            jsonb_build_object('id', 'industry-experience', 'signal', 'THE PERSPECTIVE', 'title', 'Industry-earned understanding', 'description', 'Star Energies is a new business backed by approximately 25 years of coal-industry experience.'),
            jsonb_build_object('id', 'supply-coordination', 'signal', 'THE HANDOVER', 'title', 'Commercials and logistics together', 'description', 'The commercial route and third-party delivery coordination are considered together before dispatch is aligned.')
          )
        )
      )
    END AS "published_base"
  FROM "home_page_content"
  WHERE "id" = 'primary'
)
UPDATE "home_page_content" AS "home"
SET
  "draft_content" = "draft_base" || jsonb_build_object(
    'capabilityIntro', "draft_base"->'capabilityIntro' || jsonb_build_object('label', 'Capability / 03'),
    'requirementSourcing', "draft_base"->'requirementSourcing' || jsonb_build_object('label', 'Requirement-led sourcing / 04'),
    'sourcing', "draft_base"->'sourcing' || jsonb_build_object('label', 'Coal & sourcing / 05'),
    'industries', "draft_base"->'industries' || jsonb_build_object('label', 'Industrial applications / 06'),
    'coverage', "draft_base"->'coverage' || jsonb_build_object('label', 'Operating ambition / 07'),
    'facility', "draft_base"->'facility' || jsonb_build_object('label', 'Operations / 08'),
    'quality', "draft_base"->'quality' || jsonb_build_object('label', 'Quality information / 09'),
    'experience', "draft_base"->'experience' || jsonb_build_object('label', 'Experience / 10'),
    'finalCTA', "draft_base"->'finalCTA' || jsonb_build_object('label', 'Start a conversation / 11')
  ),
  "published_content" = "published_base" || jsonb_build_object(
    'capabilityIntro', "published_base"->'capabilityIntro' || jsonb_build_object('label', 'Capability / 03'),
    'requirementSourcing', "published_base"->'requirementSourcing' || jsonb_build_object('label', 'Requirement-led sourcing / 04'),
    'sourcing', "published_base"->'sourcing' || jsonb_build_object('label', 'Coal & sourcing / 05'),
    'industries', "published_base"->'industries' || jsonb_build_object('label', 'Industrial applications / 06'),
    'coverage', "published_base"->'coverage' || jsonb_build_object('label', 'Operating ambition / 07'),
    'facility', "published_base"->'facility' || jsonb_build_object('label', 'Operations / 08'),
    'quality', "published_base"->'quality' || jsonb_build_object('label', 'Quality information / 09'),
    'experience', "published_base"->'experience' || jsonb_build_object('label', 'Experience / 10'),
    'finalCTA', "published_base"->'finalCTA' || jsonb_build_object('label', 'Start a conversation / 11')
  ),
  "updated_at" = now()
FROM prepared
WHERE "home"."id" = prepared."id";
