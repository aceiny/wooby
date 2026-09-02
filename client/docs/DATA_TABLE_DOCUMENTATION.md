# DataTable Component Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Basic Usage](#basic-usage)
4. [Props Reference](#props-reference)
5. [Header Configuration](#header-configuration)
6. [Features](#features)
7. [Subcomponents](#subcomponents)
8. [Examples](#examples)
9. [Best Practices](#best-practices)

---

## Introduction

The DataTable component is a fully-featured, production-ready table component for displaying tabular data. It includes built-in support for sorting, pagination, loading states, error handling, and empty states with beautiful light/dark mode support.

### Key Features

- ✅ **Type-safe** - Full TypeScript support with generics
- ✅ **Client-side sorting** - Click column headers to sort
- ✅ **Pagination** - Built-in pagination with page size selector
- ✅ **Loading states** - Skeleton loading animation
- ✅ **Error handling** - Beautiful error states with retry functionality
- ✅ **Empty states** - Elegant empty states with variants
- ✅ **Dark mode** - Full light/dark mode support
- ✅ **Customizable** - Custom cell renderers, nested data access
- ✅ **Responsive** - Works on all screen sizes
- ✅ **Accessible** - Proper ARIA labels and keyboard navigation

---

## Installation & Setup

The DataTable component uses the following dependencies which should already be in your project:

- `lucide-react` - For icons
- `@radix-ui/react-switch` - For the dense mode toggle

### File Structure

```
components/
├── DataTable.tsx                 # Main DataTable component
└── ui/
    ├── table.tsx                 # Base table primitives
    ├── switch.tsx                # Switch component for dense mode
    ├── empty-state.tsx           # Empty state component
    ├── error-state.tsx           # Error state component
    └── button.tsx                # Button component
```

---

## Basic Usage

```tsx
import { DataTable, type HeaderConfig } from "@/components/DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const headers: HeaderConfig<User>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
];

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
];

function MyTable() {
  return <DataTable headers={headers} data={data} />;
}
```

---

## Props Reference

### DataTableProps<T>

| Prop               | Type                | Default                 | Description                               |
| ------------------ | ------------------- | ----------------------- | ----------------------------------------- |
| `headers`          | `HeaderConfig<T>[]` | **required**            | Column configuration array                |
| `data`             | `T[]`               | **required**            | Data array to display                     |
| `keyField`         | `keyof T`           | `"id"`                  | Field to use as unique row key            |
| `title`            | `string`            | -                       | Optional table title                      |
| `showHeader`       | `boolean`           | `false`                 | Show header section with title and action |
| `actionLabel`      | `string`            | -                       | Label for action button                   |
| `onActionClick`    | `() => void`        | -                       | Action button click handler               |
| `onRowClick`       | `(row: T) => void`  | -                       | Row click handler                         |
| `isLoading`        | `boolean`           | `false`                 | Show loading skeleton                     |
| `error`            | `unknown`           | -                       | Error to display (truthy = show error)    |
| `errorVariant`     | `ErrorStateVariant` | `"default"`             | Error state variant                       |
| `errorTitle`       | `string`            | `"Failed to load data"` | Error title text                          |
| `errorMessage`     | `string`            | -                       | Error message text                        |
| `onRetry`          | `() => void`        | -                       | Retry button callback                     |
| `emptyVariant`     | `EmptyStateVariant` | `"default"`             | Empty state variant                       |
| `emptyTitle`       | `string`            | `"No data found"`       | Empty state title                         |
| `emptyDescription` | `string`            | -                       | Empty state description                   |
| `skeletonRows`     | `number`            | `5`                     | Number of skeleton rows during loading    |
| `showDenseToggle`  | `boolean`           | `true`                  | Show compact view toggle                  |
| `pagination`       | `PaginationConfig`  | -                       | Pagination configuration                  |
| `enableSorting`    | `boolean`           | `true`                  | Enable client-side sorting                |
| `sortConfig`       | `SortConfig`        | -                       | Controlled sort state                     |
| `onSortChange`     | `(config) => void`  | -                       | Sort change callback                      |
| `className`        | `string`            | -                       | Additional container class                |
| `striped`          | `boolean`           | `false`                 | Alternate row striping                    |
| `hoverable`        | `boolean`           | `true`                  | Highlight rows on hover                   |

---

## Header Configuration

### HeaderConfig<T>

| Property    | Type                        | Description                                            |
| ----------- | --------------------------- | ------------------------------------------------------ |
| `key`       | `string`                    | Key to extract data (supports dot notation for nested) |
| `label`     | `string`                    | Display label for column header                        |
| `render`    | `(value, row) => ReactNode` | Custom cell renderer                                   |
| `className` | `string`                    | Additional cell class                                  |
| `sortable`  | `boolean`                   | Whether column is sortable (default: `true`)           |
| `width`     | `string`                    | Column width (e.g., `"100px"`, `"20%"`)                |

### Nested Data Access

Use dot notation to access nested properties:

```tsx
const headers: HeaderConfig<User>[] = [
  { key: "user.profile.name", label: "Name" },
  { key: "user.contact.email", label: "Email" },
];
```

### Custom Renderers

```tsx
const headers: HeaderConfig<User>[] = [
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <Badge variant={value === "active" ? "success" : "secondary"}>
        {value}
      </Badge>
    ),
  },
  {
    key: "salary",
    label: "Salary",
    render: (value) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value as number),
    className: "text-right",
  },
];
```

---

## Features

### Sorting

Sorting is enabled by default. Click on a column header to cycle through:

1. Ascending order
2. Descending order
3. No sort (original order)

```tsx
// Disable sorting for a column
{ key: "actions", label: "Actions", sortable: false }

// Controlled sorting
const [sortConfig, setSortConfig] = useState<SortConfig>();

<DataTable
  headers={headers}
  data={data}
  sortConfig={sortConfig}
  onSortChange={setSortConfig}
/>
```

### Pagination

```tsx
const [pageIndex, setPageIndex] = useState(0);
const [pageSize, setPageSize] = useState(10);

<DataTable
  headers={headers}
  data={paginatedData}
  pagination={{
    pageIndex,
    pageSize,
    totalCount: totalItems,
    pageSizeOptions: [10, 25, 50, 100],
    onPageChange: setPageIndex,
    onPageSizeChange: setPageSize,
  }}
/>;
```

### Loading State

```tsx
const { data, isLoading } = useQuery(["users"], fetchUsers);

<DataTable
  headers={headers}
  data={data ?? []}
  isLoading={isLoading}
  skeletonRows={8}
/>;
```

### Error Handling

```tsx
const { data, error, refetch } = useQuery(["users"], fetchUsers);

<DataTable
  headers={headers}
  data={data ?? []}
  error={error}
  errorVariant="server"
  errorTitle="Failed to load users"
  errorMessage="Could not fetch user data from the server."
  onRetry={() => refetch()}
/>;
```

---

## Subcomponents

### EmptyState

Standalone empty state component with beautiful design.

```tsx
import { EmptyState } from "@/components/ui/empty-state";

<EmptyState
  variant="search" // "default" | "search" | "folder" | "file" | "database"
  title="No results found"
  description="Try adjusting your search terms."
  size="md" // "sm" | "md" | "lg"
  action={<Button>Clear filters</Button>}
/>;
```

#### EmptyState Variants

| Variant    | Icon       | Use Case                  |
| ---------- | ---------- | ------------------------- |
| `default`  | Inbox      | General empty states      |
| `search`   | SearchX    | No search results         |
| `folder`   | FolderOpen | Empty folders/collections |
| `file`     | FileX      | No files/documents        |
| `database` | Database   | No database records       |

### ErrorState

Standalone error state component with retry functionality.

```tsx
import { ErrorState } from "@/components/ui/error-state";

<ErrorState
  variant="network" // "default" | "critical" | "network" | "server" | "permission"
  title="Connection lost"
  message="Please check your internet connection."
  size="md" // "sm" | "md" | "lg"
  onRetry={() => refetch()}
  retryLabel="Retry"
  isRetrying={isLoading}
  action={<Button variant="ghost">Go offline</Button>}
/>;
```

#### ErrorState Variants

| Variant      | Icon        | Color  | Use Case         |
| ------------ | ----------- | ------ | ---------------- |
| `default`    | AlertCircle | Amber  | General warnings |
| `critical`   | XCircle     | Red    | Critical errors  |
| `network`    | WifiOff     | Blue   | Network issues   |
| `server`     | ServerCrash | Purple | Server errors    |
| `permission` | ShieldAlert | Orange | Access denied    |

---

## Examples

### Full-Featured Table

```tsx
function UsersTable() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", pageIndex, pageSize],
    queryFn: () => fetchUsers({ page: pageIndex, limit: pageSize }),
  });

  const headers: HeaderConfig<User>[] = [
    { key: "name", label: "Name", className: "font-medium" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => formatDate(value),
    },
  ];

  return (
    <DataTable<User>
      headers={headers}
      data={data?.users ?? []}
      keyField="id"
      title="Users"
      showHeader
      actionLabel="Add User"
      onActionClick={() => openCreateModal()}
      onRowClick={(user) => navigate(`/users/${user.id}`)}
      isLoading={isLoading}
      error={error}
      errorVariant="server"
      onRetry={() => refetch()}
      emptyTitle="No users found"
      emptyDescription="Create your first user to get started."
      emptyVariant="folder"
      pagination={{
        pageIndex,
        pageSize,
        totalCount: data?.total ?? 0,
        onPageChange: setPageIndex,
        onPageSizeChange: setPageSize,
      }}
      striped
      hoverable
    />
  );
}
```

### Simple Table Without Features

```tsx
<DataTable
  headers={[
    { key: "name", label: "Name" },
    { key: "value", label: "Value" },
  ]}
  data={items}
  showDenseToggle={false}
  enableSorting={false}
/>
```

---

## Best Practices

### 1. Type Your Data

Always provide a type parameter for better type safety:

```tsx
<DataTable<User> headers={headers} data={users} />
```

### 2. Handle All States

Always handle loading, error, and empty states:

```tsx
<DataTable
  isLoading={isLoading}
  error={error}
  onRetry={refetch}
  emptyTitle="No data yet"
/>
```

### 3. Use Custom Renderers for Complex Data

```tsx
{
  key: "amount",
  label: "Amount",
  render: (value) => formatCurrency(value),
}
```

### 4. Disable Sorting for Action Columns

```tsx
{ key: "actions", label: "", sortable: false }
```

### 5. Use Striped Rows for Large Tables

```tsx
<DataTable striped data={largeDataset} />
```

### 6. Provide Meaningful Empty States

```tsx
<DataTable
  emptyVariant="search"
  emptyTitle="No matching results"
  emptyDescription="Try adjusting your filters or search query."
/>
```

---

## API Reference

### Types

```typescript
// Header configuration
interface HeaderConfig<T = unknown> {
  label: string;
  key: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  width?: string;
}

// Pagination configuration
interface PaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions?: number[];
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// Sort configuration
interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// Empty state variants
type EmptyStateVariant = "default" | "search" | "folder" | "file" | "database";

// Error state variants
type ErrorStateVariant =
  | "default"
  | "critical"
  | "network"
  | "server"
  | "permission";
```

---

## Migration Guide

If you're migrating from another table component, here's how to adapt:

1. Convert your column definitions to `HeaderConfig` format
2. Replace custom loading UI with `isLoading` prop
3. Replace error handling with `error`, `errorTitle`, `errorMessage`, and `onRetry` props
4. Use the built-in pagination instead of external pagination
5. Use `render` function for custom cell formatting
