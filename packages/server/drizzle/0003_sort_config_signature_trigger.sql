-- Custom SQL migration file, put your code below! --

CREATE OR REPLACE FUNCTION sort_config_signature()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.signature := ARRAY(
    SELECT unnest(NEW.signature)
    ORDER BY 1
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER config_signature_sort
BEFORE INSERT OR UPDATE
ON configurations
FOR EACH ROW
EXECUTE FUNCTION sort_config_signature();