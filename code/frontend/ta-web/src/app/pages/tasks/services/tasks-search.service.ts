import { Injectable } from "@angular/core";
import { BaseSearchService } from "../../../shared/services/base-search.service";
import { TasksApiService } from "./tasks-api.service";
import { SortConfig } from "../../../shared/models/sort-config.model";
import { PaginatorConfig } from "../../../shared/models/paginator-config.model";
import { PaginatedResponse } from "../../../shared/models/paginated-response.model";
import { Observable } from "rxjs";
import { TaskQuery } from "../models/task-query.model";

@Injectable({ providedIn: 'root' })

export class TasksSearchService extends BaseSearchService {
    constructor(
        private tasksApiService: TasksApiService
    ) {
        super();
        this._sortConfig = this.baseSortConfig;
        this._pageConfig = this.basePageConfig;
        this._itemsPerPage = this.baseItemsPerPage;
    }

    private _sortConfig: SortConfig;
    private _pageConfig: PaginatorConfig;
    private _itemsPerPage: number[];

    getPaginated<TaskModel>(params: any): Observable<PaginatedResponse<TaskModel>> {
        const query = <TaskQuery>{
            ...this._sortConfig,
            ...this._pageConfig,
            searchValue: params.filter ?? ''
        };
        
        return this.tasksApiService.getPaginated<TaskModel>(query);
    }

    get itemsPerPage(): Readonly<number[]> {
        return this._itemsPerPage;
    }

    get sortConfig(): Readonly<SortConfig> {
        return this._sortConfig;
    }

    set sortConfig(sortConfig: SortConfig) {
        this._sortConfig = sortConfig;
    }

    get pageConfig(): Readonly<PaginatorConfig> {
        return this._pageConfig;
    }

    set pageConfig(pageConfig: PaginatorConfig) {
        this._pageConfig = pageConfig;
    }
}