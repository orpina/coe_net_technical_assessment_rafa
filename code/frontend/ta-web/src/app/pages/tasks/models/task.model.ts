export interface TaskModel{
    id: number,
    title: string;
    description: string;
    assignedUserId?: number | null
}