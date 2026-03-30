export type TableListColumn<T> =
  | {
      key: keyof T;
      label: string;
      sortable?: boolean;
      render?: (row: T) => React.ReactNode;
    }
  | {
      key: string;
      label: string;
      sortable?: false;
      render: (row: T) => React.ReactNode;
    };
