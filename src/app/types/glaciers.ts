export type GlacierStat = {
    id: number;
    dataset_name: string;
    dataset_short_name: string;
    dataset_start_date: string; // ISO date string like "2018-01-01"
    dataset_end_date: string;   // ISO date string
    dataset_glacier_stats: string;
    collection_short_name: string;
    collection_name: string;
    collection_description: string;
    publication_authors: string;
    publication_title: string;
    data_type_name: string;
    data_type_type: "continuous" | "categorical"; // based on your data
    data_type_unit: string | null;
    data_type_latex_unit: string | null;
    value: number;
  };
  
  export type GlacierStatsQueryResult = {
    rgi_id: string;
    glac_name: string | null;
    o2region : string;
    cenlon : number;
    cenlat : number;
    surge_type : number;
    rgi_area : number;
    stats: GlacierStat[];
  };


export interface GlacierStatsTableProps {
    data: GlacierStatsQueryResult;
}
  