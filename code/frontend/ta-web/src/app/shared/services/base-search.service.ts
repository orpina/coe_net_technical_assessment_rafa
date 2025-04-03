import { Injectable } from "@angular/core";
import { PaginatorConfig } from "../models/paginator-config.model";
import { SortConfig } from "../models/sort-config.model";
import { Observable } from "rxjs";
import { PaginatedResponse } from "../models/paginated-response.model";

type NewType = PaginatorConfig;

@Injectable({ providedIn: 'root' })

export abstract class BaseSearchService {
    constructor() {
        this.basePageConfig = <PaginatorConfig>{
            pageIndex: 0,
            pageSize: 25,
            itemsPerPage: [25, 50, 100]
        };

        this.baseSortConfig = <SortConfig>{
            sortProperty: "id",
            sortDirection: "desc"
        };

        this.baseItemsPerPage = [25, 50, 100];
    }

    basePageConfig: NewType;
    baseSortConfig: SortConfig;
    baseItemsPerPage: number[];

    abstract getPaginated<T>(params: any): Observable<PaginatedResponse<T>>
}