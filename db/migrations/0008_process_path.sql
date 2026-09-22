UPDATE "home_page_content"
SET
  "draft_content" = CASE
    WHEN "draft_content" ? 'process' THEN "draft_content"
    ELSE "draft_content" || jsonb_build_object(
      'process',
      jsonb_build_object(
        'label', 'How it works / 01',
        'heading', jsonb_build_array(
          jsonb_build_object('text', 'From your requirement', 'breakAfter', true),
          jsonb_build_object('text', 'to dispatch.', 'emphasis', true)
        ),
        'body', 'Five considered stages give every buyer a clear picture of the conversation before material is committed.',
        'steps', jsonb_build_array(
          jsonb_build_object('id', 'requirement', 'title', 'Requirement', 'description', 'Material, grade/GCV, size, quantity, frequency and delivery location.'),
          jsonb_build_object('id', 'sourcing', 'title', 'Sourcing', 'description', 'Suitable WCL, e-auction, supplier and trader routes are considered against the brief.'),
          jsonb_build_object('id', 'quality', 'title', 'Quality & specifications', 'description', 'Relevant material parameters and available reports are clarified for the intended application.'),
          jsonb_build_object('id', 'commercials-logistics', 'title', 'Commercials & logistics', 'description', 'The commercial route and third-party delivery coordination are discussed together.'),
          jsonb_build_object('id', 'dispatch', 'title', 'Dispatch', 'description', 'Once terms are agreed, dispatch and destination coordination are aligned to the plan.')
        )
      )
    )
  END,
  "published_content" = CASE
    WHEN "published_content" ? 'process' THEN "published_content"
    ELSE "published_content" || jsonb_build_object(
      'process',
      jsonb_build_object(
        'label', 'How it works / 01',
        'heading', jsonb_build_array(
          jsonb_build_object('text', 'From your requirement', 'breakAfter', true),
          jsonb_build_object('text', 'to dispatch.', 'emphasis', true)
        ),
        'body', 'Five considered stages give every buyer a clear picture of the conversation before material is committed.',
        'steps', jsonb_build_array(
          jsonb_build_object('id', 'requirement', 'title', 'Requirement', 'description', 'Material, grade/GCV, size, quantity, frequency and delivery location.'),
          jsonb_build_object('id', 'sourcing', 'title', 'Sourcing', 'description', 'Suitable WCL, e-auction, supplier and trader routes are considered against the brief.'),
          jsonb_build_object('id', 'quality', 'title', 'Quality & specifications', 'description', 'Relevant material parameters and available reports are clarified for the intended application.'),
          jsonb_build_object('id', 'commercials-logistics', 'title', 'Commercials & logistics', 'description', 'The commercial route and third-party delivery coordination are discussed together.'),
          jsonb_build_object('id', 'dispatch', 'title', 'Dispatch', 'description', 'Once terms are agreed, dispatch and destination coordination are aligned to the plan.')
        )
      )
    )
  END,
  "updated_at" = now()
WHERE "id" = 'primary';
