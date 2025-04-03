export interface ColumnDefinition {
    field: string;
    title: string;
    align: 'left' | 'right' | 'center';
    type?: 'options' | 'text';
    maxWidth?: number;
    sortDisabled?: boolean;
  }