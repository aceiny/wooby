# Axios API Client Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [API Clients Overview](#api-clients-overview)
3. [Setup & Configuration](#setup--configuration)
4. [Internal API Client](#internal-api-client)
5. [External API Client](#external-api-client)
6. [Error Handling](#error-handling)
7. [Making API Calls](#making-api-calls)
8. [Authentication](#authentication)
9. [Best Practices](#best-practices)
10. [Examples](#examples)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

This project uses Axios for HTTP requests with two pre-configured API clients:

- **Internal API** - For calls to your Next.js backend API routes
- **External API** - For calls to third-party services or external backends

Both clients include request/response interceptors, error handling, and authentication support.

### Key Features

- ✅ **Dual API clients** - Internal and External separated
- ✅ **Automatic error extraction** - Consistent error messages
- ✅ **Request/Response interceptors** - Add auth tokens, logging, etc.
- ✅ **Cookie support** - `withCredentials: true` for session management
- ✅ **Timeout protection** - 15-second default timeout
- ✅ **Type-safe** - Full TypeScript support

---

## API Clients Overview

### File Structure

```
lib/
├── http/
│   ├── internal-api.ts    # Next.js API routes (/api/*)
│   └── external-api.ts    # External services (full URLs)
└── utils/
    └── error.utils.ts     # Error extraction utilities
```

### When to Use Each Client

| Scenario            | Use           | Example                                  |
| ------------------- | ------------- | ---------------------------------------- |
| Next.js API route   | `internalAPI` | `/api/users`, `/api/posts`               |
| Your backend server | `externalAPI` | `https://api.yourdomain.com`             |
| Third-party API     | `externalAPI` | `https://api.stripe.com`                 |
| Database queries    | `internalAPI` | Via API routes                           |
| Authentication      | Both          | Internal for session, External for OAuth |

---

## Setup & Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```bash
# External API Base URL (optional - can use full URLs instead)
NEXT_PUBLIC_EXTERNAL_API_URL=https://api.yourdomain.com

# Other API keys
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIza...
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secret keys here!

### Installation

Axios is already installed. If not:

```bash
npm install axios
```

---

## Internal API Client

### Overview

The Internal API client is used for calling your Next.js API routes (located in `app/api/*`).

**File:** `lib/http/internal-api.ts`

### Configuration

```typescript
import axios, { AxiosInstance } from "axios";

const internalAPI: AxiosInstance = axios.create({
  baseURL: "/api", // Next.js API routes
  withCredentials: true, // Send cookies
  timeout: 15000, // 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Key Settings

| Setting           | Value              | Purpose                     |
| ----------------- | ------------------ | --------------------------- |
| `baseURL`         | `/api`             | Prefix for all requests     |
| `withCredentials` | `true`             | Include cookies in requests |
| `timeout`         | `15000`            | Cancel after 15 seconds     |
| `headers`         | `application/json` | Default content type        |

### Request Interceptor

Runs **before** every request is sent:

```typescript
internalAPI.interceptors.request.use(
  async (config) => {
    // Add custom logic here:
    // - Add auth tokens
    // - Log requests
    // - Modify headers

    // Example: Add authorization header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
```

### Response Interceptor

Runs **after** every response is received:

```typescript
internalAPI.interceptors.response.use(
  (res) => res, // Pass through successful responses
  (error: AxiosError) => {
    // Extract meaningful error message
    return Promise.reject(extractErrorMessage(error));
  },
);
```

### Usage Example

```typescript
import internalAPI from "@/lib/http/internal-api";

// GET request
const users = await internalAPI.get("/users");

// POST request
const newUser = await internalAPI.post("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// PUT request
const updated = await internalAPI.put("/users/123", {
  name: "Jane Doe",
});

// DELETE request
await internalAPI.delete("/users/123");
```

---

## External API Client

### Overview

The External API client is used for calling external services or your backend server.

**File:** `lib/http/external-api.ts`

### Configuration

```typescript
import axios, { AxiosInstance } from "axios";

const externalAPI: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXTERNAL_API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Key Differences from Internal API

| Feature   | Internal API      | External API         |
| --------- | ----------------- | -------------------- |
| Base URL  | `/api` (relative) | Environment variable |
| Use Case  | Next.js routes    | External services    |
| Full URLs | Not needed        | Supported            |

### Usage with Base URL

If `NEXT_PUBLIC_EXTERNAL_API_URL=https://api.yourdomain.com`:

```typescript
import externalAPI from "@/lib/http/external-api";

// Calls: https://api.yourdomain.com/posts
const posts = await externalAPI.get("/posts");

// Calls: https://api.yourdomain.com/users/123
const user = await externalAPI.get("/users/123");
```

### Usage without Base URL

If you want to use full URLs (remove or don't set `baseURL`):

```typescript
// Third-party API calls
const weather = await externalAPI.get(
  "https://api.openweather.org/data/2.5/weather",
  {
    params: { q: "London", appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY },
  },
);

const stripeCustomer = await externalAPI.post(
  "https://api.stripe.com/v1/customers",
  {
    email: "customer@example.com",
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  },
);
```

---

## Error Handling

### Error Utility

**File:** `lib/utils/error.utils.ts`

The `extractErrorMessage` function extracts meaningful error messages from Axios errors:

```typescript
import { AxiosError } from "axios";

export function extractErrorMessage(error: AxiosError): string {
  // 1. Check for custom error message from backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // 2. Check for standard error message
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // 3. Use HTTP status text
  if (error.response?.statusText) {
    return error.response.statusText;
  }

  // 4. Network or timeout error
  if (error.message) {
    return error.message;
  }

  // 5. Fallback
  return "An unexpected error occurred";
}
```

### Error Response Format

Your backend should return errors in this format:

```json
{
  "message": "User not found",
  "statusCode": 404,
  "error": "Not Found"
}
```

### Using Error Handling

```typescript
import internalAPI from "@/lib/http/internal-api";

try {
  const user = await internalAPI.get("/users/123");
  console.log(user.data);
} catch (error) {
  // Error is already a string (extracted message)
  console.error(error); // "User not found"
  toast.error(error); // Show to user
}
```

### Error Types

| Error Type       | Status Code | Example                 |
| ---------------- | ----------- | ----------------------- |
| Validation Error | 400         | "Email is required"     |
| Unauthorized     | 401         | "Please log in"         |
| Forbidden        | 403         | "Access denied"         |
| Not Found        | 404         | "User not found"        |
| Server Error     | 500         | "Internal server error" |
| Timeout          | -           | "Request timeout"       |
| Network Error    | -           | "Network error"         |

---

## Making API Calls

### GET Requests

```typescript
import internalAPI from "@/lib/http/internal-api";

// Simple GET
const users = await internalAPI.get("/users");

// GET with query parameters
const filteredUsers = await internalAPI.get("/users", {
  params: {
    role: "admin",
    page: 1,
    limit: 10,
  },
});
// Calls: /api/users?role=admin&page=1&limit=10

// GET with custom headers
const data = await internalAPI.get("/protected", {
  headers: {
    "X-Custom-Header": "value",
  },
});
```

### POST Requests

```typescript
// Create user
const newUser = await internalAPI.post("/users", {
  name: "John Doe",
  email: "john@example.com",
  role: "user",
});

// Upload file
const formData = new FormData();
formData.append("file", file);
formData.append("name", "avatar.jpg");

const upload = await internalAPI.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// POST with custom config
const response = await internalAPI.post("/action", data, {
  timeout: 30000, // Override default timeout
  headers: {
    "X-API-Key": "your-api-key",
  },
});
```

### PUT Requests

```typescript
// Update user
const updatedUser = await internalAPI.put("/users/123", {
  name: "Jane Doe",
  email: "jane@example.com",
});

// Partial update (PATCH)
const partial = await internalAPI.patch("/users/123", {
  name: "New Name", // Only update name
});
```

### DELETE Requests

```typescript
// Delete user
await internalAPI.delete("/users/123");

// Delete with confirmation
const confirmed = window.confirm("Delete this user?");
if (confirmed) {
  await internalAPI.delete("/users/123");
  toast.success("User deleted");
}

// Delete with body (rare)
await internalAPI.delete("/users/bulk", {
  data: {
    ids: [1, 2, 3, 4, 5],
  },
});
```

---

## Authentication

### Cookie-Based Authentication

The clients are configured with `withCredentials: true` to support cookie-based sessions.

#### Login Flow

```typescript
import internalAPI from "@/lib/http/internal-api";

async function login(email: string, password: string) {
  try {
    const response = await internalAPI.post("/auth/login", {
      email,
      password,
    });

    // Cookie is automatically stored by browser
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
```

#### Logout Flow

```typescript
async function logout() {
  try {
    await internalAPI.post("/auth/logout");
    // Cookie is automatically cleared by backend
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
```

#### Check Auth Status

```typescript
async function checkAuth() {
  try {
    const response = await internalAPI.get("/auth/me");
    return response.data; // User data
  } catch (error) {
    return null; // Not authenticated
  }
}
```

### Token-Based Authentication

If you prefer JWT tokens:

#### Store Token After Login

```typescript
async function login(email: string, password: string) {
  const response = await internalAPI.post("/auth/login", {
    email,
    password,
  });

  const { token } = response.data;
  localStorage.setItem("token", token);

  return response.data;
}
```

#### Add Token to Request Interceptor

```typescript
// In internal-api.ts
internalAPI.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

#### Handle Token Expiration

```typescript
// In response interceptor
internalAPI.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - clear and redirect
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(extractErrorMessage(error));
  },
);
```

---

## Best Practices

### 1. Create Service Functions

Don't use API clients directly in components. Create service functions:

**File:** `lib/services/user.service.ts`

```typescript
import internalAPI from "@/lib/http/internal-api";

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

**Usage in Component:**

```typescript
import { userService } from "@/lib/services/user.service";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        toast.error(error);
      }
    }
    loadUsers();
  }, []);

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

### 2. Use React Query for Data Fetching

React Query (TanStack Query) provides caching, refetching, and better state management:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";

function UserList() {
  // Automatic caching and refetching
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  // Mutations with optimistic updates
  const createUser = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created!");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

### 3. Handle Loading States

```typescript
async function handleSubmit(data: FormData) {
  setLoading(true);
  try {
    await userService.create(data);
    toast.success("User created!");
    router.push("/users");
  } catch (error) {
    toast.error(error);
  } finally {
    setLoading(false);
  }
}
```

### 4. Use TypeScript Types

Define types for your API responses:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await internalAPI.get<User[]>("/users");
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await internalAPI.post<User>("/users", data);
    return response.data;
  },
};
```

### 5. Centralize Error Handling

Create a utility for consistent error handling:

```typescript
// lib/utils/api.utils.ts
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  },
): Promise<T | null> {
  try {
    const data = await apiCall();

    if (options?.successMessage) {
      toast.success(options.successMessage);
    }

    options?.onSuccess?.(data);
    return data;
  } catch (error) {
    const errorMessage = options?.errorMessage || error;
    toast.error(errorMessage);
    options?.onError?.(error);
    return null;
  }
}
```

**Usage:**

```typescript
const user = await handleApiCall(() => userService.create(formData), {
  successMessage: "User created successfully!",
  errorMessage: "Failed to create user",
  onSuccess: () => router.push("/users"),
});
```

### 6. Add Request/Response Logging (Development Only)

```typescript
// In internal-api.ts
if (process.env.NODE_ENV === "development") {
  internalAPI.interceptors.request.use((config) => {
    console.log(
      `🔵 ${config.method?.toUpperCase()} ${config.url}`,
      config.data,
    );
    return config;
  });

  internalAPI.interceptors.response.use((response) => {
    console.log(`🟢 ${response.status} ${response.config.url}`, response.data);
    return response;
  });
}
```

---

## Examples

### Example 1: User Management

**Service File:** `lib/services/user.service.ts`

```typescript
import internalAPI from "@/lib/http/internal-api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  async getAll(params?: { role?: string; page?: number }) {
    const response = await internalAPI.get<User[]>("/users", { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await internalAPI.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: Omit<User, "id">) {
    const response = await internalAPI.post<User>("/users", data);
    return response.data;
  },

  async update(id: string, data: Partial<User>) {
    const response = await internalAPI.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await internalAPI.delete(`/users/${id}`);
  },
};
```

**Component:**

```typescript
import { userService } from "@/lib/services/user.service";

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;

    try {
      await userService.delete(id);
      toast.success("User deleted");
      loadUsers(); // Refresh list
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div>
      {loading ? <Spinner /> : (
        <div>
          {users.map(user => (
            <div key={user.id}>
              <span>{user.name}</span>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Example 2: File Upload with Progress

```typescript
import internalAPI from "@/lib/http/internal-api";

async function uploadFile(file: File, onProgress?: (progress: number) => void) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await internalAPI.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress?.(progress);
      }
    },
  });

  return response.data;
}
```

**Usage:**

```typescript
function FileUploader() {
  const [progress, setProgress] = useState(0);

  async function handleUpload(file: File) {
    try {
      const result = await uploadFile(file, setProgress);
      toast.success("File uploaded!");
      console.log("File URL:", result.url);
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {progress > 0 && <ProgressBar value={progress} />}
    </div>
  );
}
```

### Example 3: Pagination

```typescript
import internalAPI from "@/lib/http/internal-api";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchPosts(page: number = 1, pageSize: number = 10) {
  const response = await internalAPI.get<PaginatedResponse<Post>>("/posts", {
    params: { page, pageSize },
  });
  return response.data;
}
```

**Component:**

```typescript
function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      const result = await fetchPosts(page);
      setPosts(result.data);
      setTotalPages(result.totalPages);
    }
    load();
  }, [page]);

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Example 4: Parallel Requests

```typescript
import internalAPI from "@/lib/http/internal-api";

async function loadDashboard() {
  const [users, posts, stats] = await Promise.all([
    internalAPI.get("/users"),
    internalAPI.get("/posts"),
    internalAPI.get("/stats"),
  ]);

  return {
    users: users.data,
    posts: posts.data,
    stats: stats.data,
  };
}
```

### Example 5: Retry Logic

```typescript
async function fetchWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error("Max retries reached");
}

// Usage
const data = await fetchWithRetry(() => internalAPI.get("/flaky-endpoint"));
```

---

## Troubleshooting

### Issue: CORS Errors

**Problem:** Getting CORS errors when calling external API.

**Solution:**

1. Add CORS headers to your backend
2. Use a proxy through Next.js API routes
3. Set up Next.js rewrites in `next.config.js`

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://your-backend.com/:path*",
      },
    ];
  },
};
```

### Issue: Cookies Not Being Sent

**Problem:** Cookies aren't included in requests.

**Solution:**

1. Ensure `withCredentials: true` is set
2. Backend must send `Access-Control-Allow-Credentials: true`
3. Backend must specify exact origin (not `*`)

```typescript
// Backend (Express example)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

### Issue: Request Timeout

**Problem:** Requests timing out after 15 seconds.

**Solution:** Increase timeout for specific requests:

```typescript
const data = await internalAPI.get("/slow-endpoint", {
  timeout: 60000, // 60 seconds
});
```

### Issue: Large Payload Errors

**Problem:** Getting errors with large file uploads.

**Solution:**

1. Increase timeout
2. Use `multipart/form-data`
3. Check backend size limits

```typescript
const formData = new FormData();
formData.append("file", largeFile);

await internalAPI.post("/upload", formData, {
  timeout: 300000, // 5 minutes
  headers: {
    "Content-Type": "multipart/form-data",
  },
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});
```

### Issue: TypeScript Errors with Response Types

**Problem:** TypeScript can't infer response types.

**Solution:** Explicitly type the response:

```typescript
interface User {
  id: string;
  name: string;
}

// ✅ Good
const response = await internalAPI.get<User>("/users/123");
const user: User = response.data;

// ❌ Bad
const response = await internalAPI.get("/users/123");
const user = response.data; // Type is 'any'
```

---

## Environment-Specific Configuration

### Development

```typescript
// .env.local
NEXT_PUBLIC_EXTERNAL_API_URL=http://localhost:4000
```

### Staging

```typescript
// .env.staging
NEXT_PUBLIC_EXTERNAL_API_URL=https://staging-api.yourdomain.com
```

### Production

```typescript
// .env.production
NEXT_PUBLIC_EXTERNAL_API_URL=https://api.yourdomain.com
```

---

## Advanced Patterns

### Request Cancellation

```typescript
import axios from "axios";

function SearchComponent() {
  const [results, setResults] = useState([]);
  const cancelTokenSource = useRef<any>(null);

  async function search(query: string) {
    // Cancel previous request
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel("New search initiated");
    }

    // Create new cancel token
    cancelTokenSource.current = axios.CancelToken.source();

    try {
      const response = await internalAPI.get("/search", {
        params: { q: query },
        cancelToken: cancelTokenSource.current.token,
      });
      setResults(response.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error);
      }
    }
  }

  return <input onChange={(e) => search(e.target.value)} />;
}
```

### Request Queue

```typescript
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = false;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.running || this.queue.length === 0) return;

    this.running = true;
    const request = this.queue.shift()!;
    await request();
    this.running = false;
    this.process();
  }
}

const queue = new RequestQueue();

// Usage
await queue.add(() => internalAPI.post("/action1", data1));
await queue.add(() => internalAPI.post("/action2", data2));
```

---

## Security Considerations

### 1. Never Expose Secrets

```typescript
// ❌ NEVER DO THIS
const API_KEY = "sk_live_abc123"; // Exposed in client code

// ✅ DO THIS - Use API routes
// Call your Next.js API route which stores the secret securely
await internalAPI.post("/api/stripe-payment", data);
```

### 2. Validate User Input

```typescript
// Sanitize before sending
function sanitizeInput(input: string): string {
  return input.trim().replace(/<script>/gi, "");
}

const cleanData = {
  name: sanitizeInput(formData.name),
  email: sanitizeInput(formData.email),
};

await internalAPI.post("/users", cleanData);
```

### 3. Use HTTPS in Production

```typescript
// Enforce HTTPS
if (
  process.env.NODE_ENV === "production" &&
  !window.location.protocol === "https:"
) {
  window.location.href = "https:" + window.location.href.substring(5);
}
```

---

## Related Documentation

- [Form System Documentation](./FORM_SYSTEM_DOCUMENTATION.md)
- [React Hook Form](https://react-hook-form.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [TanStack Query](https://tanstack.com/query/latest)

---

**Last Updated:** November 20, 2025
**Version:** 1.0.0
