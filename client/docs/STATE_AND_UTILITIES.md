# State Management & Utilities Documentation

## Table of Contents

1. [Zustand State Management](#zustand-state-management)
2. [React Query (TanStack Query)](#react-query-tanstack-query)
3. [Toast Notifications (Sonner)](#toast-notifications-sonner)
4. [Path Constants](#path-constants)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

---

## Zustand State Management

### Overview

Zustand is a small, fast state management solution for React. This project includes pre-configured stores for common use cases.

**Key Features:**

- ✅ Minimal boilerplate
- ✅ No context providers needed
- ✅ TypeScript support
- ✅ Persistent storage (localStorage)
- ✅ Selectors for optimized re-renders

### File Structure

```
stores/
├── auth.store.ts      # Authentication state
├── ui.store.ts        # UI state (sidebar, modals, notifications)
└── index.ts           # Central export point
```

---

### Auth Store

Manages user authentication state with persistent storage.

**File:** `stores/auth.store.ts`

#### Usage

```tsx
import { useAuthStore } from "@/stores/auth.store";

function UserProfile() {
  const { user, login, logout, updateUser } = useAuthStore();

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.name}</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login(userData)}>Login</button>
      )}
    </div>
  );
}
```

#### API Reference

| Property/Method       | Type                               | Description            |
| --------------------- | ---------------------------------- | ---------------------- |
| `user`                | `User \| null`                     | Current user object    |
| `isAuthenticated`     | `boolean`                          | Authentication status  |
| `isLoading`           | `boolean`                          | Loading state          |
| `login(user)`         | `(user: User) => void`             | Login user             |
| `logout()`            | `() => void`                       | Logout and clear state |
| `setUser(user)`       | `(user: User \| null) => void`     | Set user directly      |
| `updateUser(updates)` | `(updates: Partial<User>) => void` | Update specific fields |
| `setLoading(loading)` | `(loading: boolean) => void`       | Set loading state      |

#### User Type

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
```

#### Using Selectors (Optimized)

Selectors prevent unnecessary re-renders by selecting only the data you need:

```tsx
import { useAuthStore, selectUser, selectIsAuthenticated } from "@/stores";

function Header() {
  // Only re-renders when user changes (not when isLoading changes)
  const user = useAuthStore(selectUser);

  return <div>Hello, {user?.name}</div>;
}

function ProtectedRoute() {
  // Only re-renders when isAuthenticated changes
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Dashboard />;
}
```

#### Complete Login/Logout Example

```tsx
import { useAuthStore } from "@/stores";
import { internalAPI } from "@/lib/http/internal-api";
import { toast } from "sonner";

function LoginForm() {
  const { login, setLoading } = useAuthStore();

  async function handleLogin(email: string, password: string) {
    setLoading(true);
    try {
      const response = await internalAPI.post("/auth/login", {
        email,
        password,
      });
      login(response.data.user);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={handleLogin}>...</form>;
}

function LogoutButton() {
  const { logout } = useAuthStore();

  async function handleLogout() {
    try {
      await internalAPI.post("/auth/logout");
      logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return <button onClick={handleLogout}>Logout</button>;
}
```

#### Persistence

The auth store automatically persists to `localStorage` under the key `auth-storage`. It survives page refreshes.

To clear persisted data:

```typescript
localStorage.removeItem("auth-storage");
```

---

### UI Store

Manages application-wide UI state (sidebar, modals, notifications).

**File:** `stores/ui.store.ts`

#### Usage

```tsx
import { useUIStore } from "@/stores/ui.store";

function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={isSidebarOpen ? "block" : "hidden"}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
}
```

#### API Reference

| Property/Method            | Type                                 | Description               |
| -------------------------- | ------------------------------------ | ------------------------- |
| `isSidebarOpen`            | `boolean`                            | Sidebar open/closed state |
| `isModalOpen`              | `boolean`                            | Modal open/closed state   |
| `modalContent`             | `React.ReactNode \| null`            | Modal content             |
| `notifications`            | `number`                             | Notification count        |
| `toggleSidebar()`          | `() => void`                         | Toggle sidebar            |
| `openSidebar()`            | `() => void`                         | Open sidebar              |
| `closeSidebar()`           | `() => void`                         | Close sidebar             |
| `openModal(content)`       | `(content: React.ReactNode) => void` | Open modal with content   |
| `closeModal()`             | `() => void`                         | Close modal               |
| `setNotifications(count)`  | `(count: number) => void`            | Set notification count    |
| `incrementNotifications()` | `() => void`                         | Increment by 1            |
| `clearNotifications()`     | `() => void`                         | Clear all notifications   |

#### Modal Example

```tsx
import { useUIStore } from "@/stores";

function DeleteConfirmation({ onConfirm }: { onConfirm: () => void }) {
  const { closeModal } = useUIStore();

  return (
    <div className="p-6">
      <h2>Are you sure?</h2>
      <button
        onClick={() => {
          onConfirm();
          closeModal();
        }}
      >
        Yes, delete
      </button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
}

function UserList() {
  const { openModal } = useUIStore();

  function handleDeleteClick(userId: string) {
    openModal(<DeleteConfirmation onConfirm={() => deleteUser(userId)} />);
  }

  return <button onClick={() => handleDeleteClick("123")}>Delete</button>;
}

// In your layout or App component
function App() {
  const { isModalOpen, modalContent, closeModal } = useUIStore();

  return (
    <>
      <YourApp />
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
}
```

#### Notification Badge Example

```tsx
import { useUIStore, selectNotifications } from "@/stores";

function NotificationBell() {
  const notifications = useUIStore(selectNotifications);
  const { clearNotifications } = useUIStore();

  return (
    <button className="relative" onClick={clearNotifications}>
      <BellIcon />
      {notifications > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2">
          {notifications}
        </span>
      )}
    </button>
  );
}
```

---

### Creating Custom Stores

Here's a template for creating your own Zustand store:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* Types */
interface MyState {
  data: string[];
  loading: boolean;
}

interface MyActions {
  addData: (item: string) => void;
  removeData: (item: string) => void;
  setLoading: (loading: boolean) => void;
}

type MyStore = MyState & MyActions;

/* Initial State */
const initialState: MyState = {
  data: [],
  loading: false,
};

/* Store */
export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      ...initialState,

      addData: (item) =>
        set((state) => ({
          data: [...state.data, item],
        })),

      removeData: (item) =>
        set((state) => ({
          data: state.data.filter((d) => d !== item),
        })),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "my-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/* Selectors */
export const selectData = (state: MyStore) => state.data;
export const selectLoading = (state: MyStore) => state.loading;
```

---

## React Query (TanStack Query)

### Overview

React Query handles server state management with automatic caching, background refetching, and optimistic updates.

**Key Features:**

- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Request deduplication
- ✅ DevTools for debugging

### Configuration

**File:** `config/query.client.config.ts`

The project comes with pre-configured defaults:

```typescript
import { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
};
```

### Setup

The provider is already configured in `app/layout.tsx`:

```tsx
import ReactQueryProvider from "@/providers/react-query.provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
```

### Usage Examples

#### Basic Query (GET)

```tsx
import { useQuery } from "@tanstack/react-query";
import { internalAPI } from "@/lib/http/internal-api";

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await internalAPI.get("/users");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

#### Query with Parameters

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ["users", userId], // Include params in key
    queryFn: async () => {
      const response = await internalAPI.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Only run if userId exists
  });

  return <div>{user?.name}</div>;
}
```

#### Mutation (POST/PUT/DELETE)

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function CreateUserForm() {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await internalAPI.post("/users", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function handleSubmit(data: CreateUserDto) {
    await createUser.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

#### Optimistic Updates

```tsx
function LikeButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await internalAPI.post(`/posts/${postId}/like`);
    },
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData(["posts", postId]);

      // Optimistically update
      queryClient.setQueryData(["posts", postId], (old: any) => ({
        ...old,
        likes: old.likes + 1,
      }));

      return { previousPost };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(["posts", postId], context?.previousPost);
      toast.error("Failed to like post");
    },
    onSettled: (postId) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });

  return <button onClick={() => likeMutation.mutate(postId)}>Like</button>;
}
```

#### Pagination

```tsx
function PostList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const response = await internalAPI.get("/posts", {
        params: { page, pageSize: 10 },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData, // Keep old data while fetching
  });

  return (
    <div>
      {data?.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
```

#### Infinite Scroll

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

function InfinitePostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await internalAPI.get("/posts", {
          params: { page: pageParam },
        });
        return response.data;
      },
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
    });

  return (
    <div>
      {data?.pages.map((page) =>
        page.posts.map((post) => <PostCard key={post.id} post={post} />),
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

#### Service Layer Pattern (Recommended)

Create service files that encapsulate API calls:

**File:** `lib/services/user.service.ts`

```typescript
import { internalAPI } from "@/lib/http/internal-api";

export const userService = {
  async getAll() {
    const response = await internalAPI.get("/users");
    return response.data;
  },

  async getById(id: string) {
    const response = await internalAPI.get(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserDto) {
    const response = await internalAPI.post("/users", data);
    return response.data;
  },

  async update(id: string, data: UpdateUserDto) {
    const response = await internalAPI.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await internalAPI.delete(`/users/${id}`);
  },
};
```

**Usage in component:**

```tsx
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";

function UserList() {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  return (
    <div>
      {users?.map((user) => (
        <UserCard user={user} />
      ))}
    </div>
  );
}
```

---

## Toast Notifications (Sonner)

### Overview

Sonner is a beautiful, lightweight toast notification library with excellent theme support.

**Key Features:**

- ✅ Multiple toast types (success, error, info, warning)
- ✅ Promise-based toasts
- ✅ Custom icons
- ✅ Dark mode support
- ✅ Rich colors

### Setup

Already configured in `app/layout.tsx`:

```tsx
import { Toaster } from "@/components/ui/sonner";

<Toaster
  position="top-right"
  duration={3000}
  richColors
  closeButton
  visibleToasts={5}
/>;
```

### Basic Usage

```tsx
import { toast } from "sonner";

// Simple toast
toast("Event has been created");

// Success toast
toast.success("User created successfully");

// Error toast
toast.error("Failed to create user");

// Info toast
toast.info("Please check your email");

// Warning toast
toast.warning("This action cannot be undone");
```

### Toast Options

```tsx
toast.success("Profile updated", {
  description: "Your changes have been saved",
  duration: 5000,
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

### Promise-Based Toasts

Perfect for async operations:

```tsx
import { toast } from "sonner";
import { internalAPI } from "@/lib/http/internal-api";

async function createUser(data: CreateUserDto) {
  toast.promise(internalAPI.post("/users", data), {
    loading: "Creating user...",
    success: (response) => `User ${response.data.name} created!`,
    error: "Failed to create user",
  });
}
```

### Toast Messages Constants

Use predefined messages for consistency:

**File:** `shared/constants/toast-messages.ts`

```typescript
export const toastMessages = {
  default: {
    eventCreated: "Event has been created",
  },
  success: {
    eventCreated: "Event created successfully",
    userCreated: "User created successfully",
    profileUpdated: "Profile updated successfully",
  },
  info: {
    arriveEarly: "Arrive 10 minutes early to prepare for the event",
  },
  warning: {
    tooEarly: "The event cannot start earlier than 8:00 AM",
  },
  error: {
    eventFailed: "Failed to create the event",
    networkError: "Network error. Please try again.",
  },
  promise: {
    loading: "Creating event...",
    success: (data: { name: string }) => `${data.name} has been created`,
    error: "Something went wrong while creating the event.",
  },
} as const;
```

**Usage:**

```tsx
import { toast } from "sonner";
import { toastMessages } from "@/shared/constants/toast-messages";

toast.success(toastMessages.success.userCreated);
toast.error(toastMessages.error.networkError);
```

### Custom Toast Component

```tsx
import { toast } from "sonner";

function CustomToast() {
  return (
    <div className="flex items-center gap-2">
      <Avatar src="/user.jpg" />
      <div>
        <p className="font-semibold">John Doe</p>
        <p className="text-sm">Sent you a message</p>
      </div>
    </div>
  );
}

// Show custom toast
toast(<CustomToast />);
```

### Integration with Forms

```tsx
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function LoginForm() {
  const { handleSubmit, register } = useForm();

  async function onSubmit(data: LoginDto) {
    try {
      await internalAPI.post("/auth/login", data);
      toast.success("Login successful!", {
        description: "Welcome back!",
      });
    } catch (error) {
      toast.error("Login failed", {
        description: error.message,
      });
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

---

## Path Constants

### Overview

Centralized path management prevents hardcoded URLs and typos.

**File:** `shared/constants/paths.ts`

### Usage

```typescript
export const APP_PATHS = {
  BASE: "/",
  EXAMPLE: "/example",

  AUTH: {
    BASE: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
} as const;
```

### Using in Components

```tsx
import { APP_PATHS } from "@/shared/constants/paths";
import { useRouter } from "next/navigation";

function LoginButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.push(APP_PATHS.AUTH.LOGIN)}>Login</button>
  );
}
```

### Using in Links

```tsx
import Link from "next/link";
import { APP_PATHS } from "@/shared/constants/paths";

function Navigation() {
  return (
    <nav>
      <Link href={APP_PATHS.BASE}>Home</Link>
      <Link href={APP_PATHS.EXAMPLE}>Examples</Link>
      <Link href={APP_PATHS.AUTH.LOGIN}>Login</Link>
      <Link href={APP_PATHS.AUTH.REGISTER}>Register</Link>
    </nav>
  );
}
```

### Dynamic Paths

Create helper functions for dynamic routes:

```typescript
export const APP_PATHS = {
  // ... other paths

  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    EDIT: (id: string) => `/users/${id}/edit`,
  },

  POSTS: {
    LIST: "/posts",
    DETAIL: (slug: string) => `/posts/${slug}`,
    CREATE: "/posts/create",
  },
} as const;
```

**Usage:**

```tsx
import { APP_PATHS } from "@/shared/constants/paths";

// Navigate to user detail page
router.push(APP_PATHS.USERS.DETAIL("123"));

// Navigate to post detail page
router.push(APP_PATHS.POSTS.DETAIL("my-first-post"));
```

### API Paths

You can also centralize API paths:

```typescript
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;
```

**Usage:**

```tsx
import { API_PATHS } from "@/shared/constants/paths";
import { internalAPI } from "@/lib/http/internal-api";

// Get user
const user = await internalAPI.get(API_PATHS.USERS.DETAIL("123"));

// Update user
await internalAPI.put(API_PATHS.USERS.UPDATE("123"), data);
```

---

## Best Practices

### 1. Combine Zustand + React Query

Use Zustand for UI state, React Query for server state:

```tsx
import { useAuthStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";

function Dashboard() {
  // Client state (Zustand)
  const { user } = useAuthStore();

  // Server state (React Query)
  const { data: stats } = useQuery({
    queryKey: ["stats", user?.id],
    queryFn: () => userService.getStats(user!.id),
    enabled: !!user,
  });

  return <div>...</div>;
}
```

### 2. Toast + React Query Integration

```tsx
const createUser = useMutation({
  mutationFn: userService.create,
  onSuccess: () => {
    toast.success(toastMessages.success.userCreated);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### 3. Type-Safe Path Navigation

```tsx
// ❌ Bad - hardcoded strings
router.push("/users/123/edit");

// ✅ Good - using constants
router.push(APP_PATHS.USERS.EDIT("123"));
```

### 4. Centralize Toast Messages

```tsx
// ❌ Bad - inline strings
toast.success("User created successfully");

// ✅ Good - using constants
toast.success(toastMessages.success.userCreated);
```

### 5. Use Selectors to Prevent Re-renders

```tsx
// ❌ Bad - entire component re-renders on any auth change
const { user, isAuthenticated, isLoading } = useAuthStore();

// ✅ Good - only re-renders when user changes
const user = useAuthStore(selectUser);
```

---

## Examples

### Example 1: Complete Authentication Flow

```tsx
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { APP_PATHS } from "@/shared/constants/paths";
import { toastMessages } from "@/shared/constants/toast-messages";
import { internalAPI } from "@/lib/http/internal-api";
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const response = await internalAPI.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user);
      toast.success("Login successful!");
      router.push(APP_PATHS.BASE);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function handleSubmit(data: LoginDto) {
    setLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 2: User Management with All Features

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/stores";
import { toast } from "sonner";
import { APP_PATHS } from "@/shared/constants/paths";
import { userService } from "@/lib/services/user.service";

function UserManagement() {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useUIStore();

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleDeleteClick(userId: string, userName: string) {
    openModal(
      <div className="p-6">
        <h2>Delete User</h2>
        <p>Are you sure you want to delete {userName}?</p>
        <button onClick={() => deleteMutation.mutate(userId)}>
          Confirm Delete
        </button>
        <button onClick={closeModal}>Cancel</button>
      </div>,
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleDeleteClick(user.id, user.name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Form with Toast Notifications

```tsx
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastMessages } from "@/shared/constants/toast-messages";

function CreatePostForm() {
  const { handleSubmit, register, reset } = useForm();

  const createPost = useMutation({
    mutationFn: async (data: CreatePostDto) => {
      return toast.promise(internalAPI.post("/posts", data), {
        loading: "Creating post...",
        success: (response) => `Post "${response.data.title}" created!`,
        error: "Failed to create post",
      });
    },
    onSuccess: () => {
      reset();
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => createPost.mutate(data))}>
      <input {...register("title")} />
      <textarea {...register("content")} />
      <button type="submit" disabled={createPost.isPending}>
        Create Post
      </button>
    </form>
  );
}
```

---

## Related Documentation

- [Form System Documentation](./FORM_SYSTEM_DOCUMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Sonner Documentation](https://sonner.emilkowal.ski/)

---

**Last Updated:** November 20, 2025
**Version:** 1.0.0
