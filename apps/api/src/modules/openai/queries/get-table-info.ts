export const getTableInfoQuery = (table_name: string) => `
SELECT 
   table_name, 
   column_name, 
   data_type
FROM 
   information_schema.columns
WHERE 
   table_name = '${table_name}';
`;
