import { BaseFilterModel } from "../../../shared/models/base-filter.model";

export interface TaskSearchFilterModel extends BaseFilterModel {
    assignedUserId?: number;
}