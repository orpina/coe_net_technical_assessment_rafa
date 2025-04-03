import { PaginatorConfig } from "../../../shared/models/paginator-config.model";
import { SortConfig } from "../../../shared/models/sort-config.model";

export interface TaskQuery extends SortConfig, PaginatorConfig{
    searchValue?: string;
}