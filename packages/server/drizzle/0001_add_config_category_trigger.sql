-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION check_config_category()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_category_id UUID;
  new_category_name VARCHAR;
BEGIN
  SELECT assets.category_id, categories.name
  INTO new_category_id, new_category_name
  FROM assets
    JOIN categories
    ON assets.category_id = categories.id
  WHERE assets.id = NEW.asset_id;

  IF EXISTS(
    SELECT 1
    FROM config_assets
    INNER JOIN assets
      ON assets.id = config_assets.asset_id
    WHERE config_assets.config_id = NEW.config_id
      AND assets.category_id = new_category_id 
  ) THEN
    RAISE EXCEPTION
      'Config % already contains an asset from the % category',
        NEW.config_id,
        new_category_name;
  END IF;

  RETURN NEW;

END;
$$;

CREATE TRIGGER config_asset_category_check
BEFORE INSERT OR UPDATE
ON config_assets
FOR EACH ROW
EXECUTE FUNCTION check_config_category();