export interface ColumnDefinition {
    field: string;
    title: string;
    align: 'left' | 'right' | 'center';
    type?: 'options' | 'text' | 'boolText';
    maxWidth?: number;
    sortDisabled?: boolean;
  }