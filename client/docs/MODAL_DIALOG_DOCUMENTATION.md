# 🎯 Modal/Dialog System Documentation

A powerful, flexible dialog system built with React and shadcn/ui, featuring per-button loading states, async handler support, and multiple customization options.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Per-Button Loading States](#per-button-loading-states)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)

---

## Overview

The `useDialog` hook provides a complete solution for managing dialog state with:

✅ **Declarative Dialog Management** - Define once, reuse everywhere  
✅ **Per-Button Loading States** - Individual control for each button  
✅ **Async Handler Support** - Automatic loading during async operations  
✅ **Form Integration** - Built-in form support with custom JSX  
✅ **Theme Support** - Full light/dark mode support  
✅ **TypeScript Support** - Complete type safety  
✅ **Flexible Buttons** - Cancel, Middle (optional), and Action buttons  
✅ **Size Variants** - Small (sm), Medium (md), Large (lg), Extra Large (xl)

---

## Quick Start

### Option 1: Using the `useDialog` Hook (Recommended)

The `useDialog` hook provides the simplest, most declarative way to manage dialogs:

```tsx
"use client";

import { useDialog } from "@/hooks/useDialog";

export function MyComponent() {
  const dialog = useDialog({
    title: "Delete User",
    subtitle: "Are you sure you want to delete this user?",
    size: "md",
    cancelButton: {
      label: "Cancel",
    },
    actionButton: {
      label: "Delete",
      variant: "destructive",
      onClick: async () => {
        await deleteUser();
      },
    },
  });

  return (
    <div>
      <button onClick={dialog.openDialog}>Delete User</button>
      {dialog.dialog} {/* Renders the dialog */}
    </div>
  );
}
```

### Option 2: Using `DialogCreator` Component Directly

For more control or simple use cases, use the `DialogCreator` component directly:

```tsx
"use client";

import { useState } from "react";
import { DialogCreator } from "@/components/DialogCreator";
import { DialogConfig } from "@/hooks/useDialog";

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const dialogConfig: DialogConfig = {
    title: "Delete User",
    subtitle: "Are you sure you want to delete this user?",
    size: "md",
    cancelButton: {
      label: "Cancel",
    },
    actionButton: {
      label: "Delete",
      variant: "destructive",
      onClick: async () => {
        await deleteUser();
        setIsOpen(false);
      },
    },
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Delete User</button>
      <DialogCreator
        isOpen={isOpen}
        config={dialogConfig}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
```

### Comparison: Hook vs Component

| Feature             | `useDialog` Hook | `DialogCreator` Component |
| ------------------- | ---------------- | ------------------------- |
| Setup Complexity    | ⭐ Simplest      | ⭐⭐ More code            |
| Auto Loading States | ✅ Yes           | ✅ Yes                    |
| Per-Button Loading  | ✅ Yes           | ✅ Yes                    |
| State Management    | ✅ Automatic     | ⭐ Manual                 |
| Type Safety         | ✅ Full          | ✅ Full                   |
| Recommended         | ✅ Yes           | For simple cases          |

**When to use Hook:** Most use cases (recommended)  
**When to use Component:** Simple one-off dialogs, more granular control

---

## API Reference

### `useDialog(initialConfig?): UseDialogReturn`

#### Parameters

| Parameter       | Type           | Description                  | Optional |
| --------------- | -------------- | ---------------------------- | -------- |
| `initialConfig` | `DialogConfig` | Initial dialog configuration | ✅ Yes   |

#### Return Type

```typescript
interface UseDialogReturn {
  dialog: React.ReactNode; // React component to render
  isOpen: boolean; // Whether dialog is visible
  isLoading: boolean; // Global loading state
  openDialog: (overrideConfig?: Partial<DialogConfig>) => void; // Open dialog
  closeDialog: () => void; // Close dialog
  setLoading: (loading: boolean) => void; // Manually control loading
}
```

### `DialogConfig` Interface

```typescript
interface DialogConfig {
  title: string; // Dialog title (required)
  subtitle?: string; // Optional subtitle
  form?: React.ReactNode; // Optional form content
  cancelButton?: DialogButton & { label: string };
  middleButton?: DialogButton & { label: string }; // Optional
  actionButton?: DialogButton & { label: string };
  onClose?: () => void; // Called when dialog closes
  size?: "sm" | "md" | "lg" | "xl"; // Dialog width (default: "md")
}
```

### `DialogButton` Interface

```typescript
interface DialogButton {
  label: string; // Button text
  onClick?: () => void | Promise<void>; // Click handler
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  loading?: boolean; // External loading state (optional)
}
```

#### Button Variants

| Variant       | Appearance                           |
| ------------- | ------------------------------------ |
| `default`     | Blue button with white text          |
| `destructive` | Red button for dangerous actions     |
| `outline`     | Border-only button                   |
| `secondary`   | Secondary action button              |
| `ghost`       | Transparent button with hover effect |

#### Size Options

| Size | Width      | Use Case                      |
| ---- | ---------- | ----------------------------- |
| `sm` | `max-w-sm` | Small dialogs (confirmations) |
| `md` | `max-w-md` | Default dialog size           |
| `lg` | `max-w-lg` | Large dialogs (forms)         |
| `xl` | `max-w-xl` | Extra large dialogs           |

---

## Usage Examples

### 1. Simple Confirmation Dialog (Hook)

```tsx
const dialog = useDialog({
  title: "Confirm Action",
  subtitle: "Are you sure you want to proceed?",
  size: "sm",
  cancelButton: {
    label: "Cancel",
  },
  actionButton: {
    label: "Confirm",
    onClick: () => {
      console.log("Confirmed!");
    },
  },
});

return (
  <>
    <button onClick={dialog.openDialog}>Open</button>
    {dialog.dialog}
  </>
);
```

### 2. Delete Dialog (Destructive Action)

```tsx
const deleteDialog = useDialog({
  title: "Delete User",
  subtitle: "This action cannot be undone.",
  size: "md",
  cancelButton: {
    label: "Cancel",
  },
  actionButton: {
    label: "Delete User",
    variant: "destructive",
    onClick: async () => {
      await api.deleteUser(userId);
    },
  },
});

return (
  <>
    <button onClick={deleteDialog.openDialog} className="text-red-600">
      Delete
    </button>
    {deleteDialog.dialog}
  </>
);
```

### 3. Form Dialog with All Three Buttons (Hook)

```tsx
const editDialog = useDialog({
  title: "Edit Profile",
  subtitle: "Update your profile information",
  form: (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  ),
  size: "lg",
  cancelButton: {
    label: "Cancel",
  },
  middleButton: {
    label: "Save as Draft",
    variant: "secondary",
    onClick: async () => {
      await saveDraft();
    },
  },
  actionButton: {
    label: "Save Changes",
    variant: "default",
    onClick: async () => {
      await saveProfile();
    },
  },
});

return (
  <>
    <button onClick={editDialog.openDialog}>Edit Profile</button>
    {editDialog.dialog}
  </>
);
```

### 4. Override Config When Opening

You can override specific config properties when opening:

```tsx
const dialog = useDialog({
  title: "Confirm",
  cancelButton: { label: "Cancel" },
  actionButton: {
    label: "Proceed",
    onClick: async () => await action(),
  },
});

// Override title when opening
<button onClick={() => dialog.openDialog({ title: "Custom Title" })}>
  Open with Custom Title
</button>;
```

### 5. DialogCreator Component Direct Usage (No Hook)

Use the `DialogCreator` component directly for simple, lightweight dialogs:

```tsx
"use client";

import { useState } from "react";
import { DialogCreator } from "@/components/DialogCreator";
import { DialogConfig } from "@/hooks/useDialog";

export function SimpleDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const config: DialogConfig = {
    title: "Confirm Delete",
    subtitle: "Are you sure you want to delete this item?",
    size: "sm",
    cancelButton: {
      label: "Cancel",
    },
    actionButton: {
      label: "Delete",
      variant: "destructive",
      loading: isLoading,
      onClick: async () => {
        setIsLoading(true);
        try {
          await deleteItem();
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      },
    },
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Item</button>
      <DialogCreator
        isOpen={isOpen}
        config={config}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

**Advantages of Direct Component Usage:**

- Less abstraction
- Direct control over state
- Simpler for one-off dialogs
- Manual control over loading states

**When to Choose:**

- Simple confirmation dialogs
- One-time use dialogs
- Need granular state control

---

## Per-Button Loading States

### Automatic Loading (Internal State)

When you omit the `loading` parameter, the dialog automatically manages loading during async operations:

```tsx
const dialog = useDialog({
  actionButton: {
    label: "Save",
    // No loading param = automatic internal loading
    onClick: async () => {
      await saveToDB(); // Button shows spinner during this
    },
  },
});
```

**Behavior:**

- Spinner appears when button is clicked
- Button is disabled during async operation
- Spinner disappears when operation completes

### External Loading Control

When you provide `loading: true/false`, the button uses external state:

```tsx
const [isSaving, setIsSaving] = useState(false);

const dialog = useDialog({
  actionButton: {
    label: "Save",
    loading: isSaving, // Controlled externally
    onClick: async () => {
      setIsSaving(true);
      try {
        await saveToDB();
      } finally {
        setIsSaving(false);
      }
    },
  },
});
```

**Use Cases:**

- Coordinating with parent component loading state
- Showing loading state from API response
- Conditional button behavior

### Mixed Usage (Recommended)

Combine internal and external loading for flexibility:

```tsx
const [submitLoading, setSubmitLoading] = useState(false);

const dialog = useDialog({
  title: "Settings",

  cancelButton: {
    label: "Cancel",
    // Internal: auto-managed (just closes)
  },

  middleButton: {
    label: "Reset to Defaults",
    // Internal: auto-managed async operation
    onClick: async () => {
      await resetSettings();
    },
  },

  actionButton: {
    label: "Save",
    loading: submitLoading, // External: parent controls
    onClick: async () => {
      setSubmitLoading(true);
      try {
        await submitForm();
      } finally {
        setSubmitLoading(false);
      }
    },
  },
});
```

---

## Advanced Features

### 1. Get Dialog State

Access dialog state directly:

```tsx
const dialog = useDialog({
  /* config */
});

// Check if dialog is open
if (dialog.isOpen) {
  console.log("Dialog is visible");
}

// Check global loading state
if (dialog.isLoading) {
  console.log("Something is loading");
}
```

### 2. Programmatic Control

```tsx
// Open dialog from outside
<button onClick={() => dialog.openDialog()}>Open</button>

// Close dialog from outside
<button onClick={dialog.closeDialog}>Close</button>

// Set loading manually
<button onClick={() => dialog.setLoading(true)}>Start Loading</button>
```

### 3. Dynamic Title/Subtitle

```tsx
const dialog = useDialog({
  /* config */
});

<button
  onClick={() =>
    dialog.openDialog({
      title: `Delete ${itemName}?`,
      subtitle: `Are you sure you want to delete "${itemName}"?`,
    })
  }
>
  Delete Item
</button>;
```

### 4. Custom Form Integration

```tsx
import { useForm } from "react-hook-form";

const { register, handleSubmit } = useForm();

const dialog = useDialog({
  title: "Create User",
  form: (
    <form className="space-y-4">
      <input
        {...register("name")}
        placeholder="Name"
        className="w-full px-3 py-2 border rounded"
      />
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded"
      />
    </form>
  ),
  actionButton: {
    label: "Create",
    onClick: async () => {
      const data = await handleSubmit(async (formData) => {
        await createUser(formData);
      })();
    },
  },
});
```

### 5. Close on Action

Dialogs automatically close after successful action, but you can manually close:

```tsx
const dialog = useDialog({
  actionButton: {
    label: "Delete",
    onClick: async () => {
      try {
        await deleteItem();
        dialog.closeDialog(); // Manual close
      } catch (error) {
        console.error(error); // Dialog stays open on error
      }
    },
  },
});
```

---

## Best Practices

### 1. **Reusable Dialog Hooks**

Create custom hooks for common dialogs:

```tsx
// hooks/useDeleteConfirmDialog.ts
export function useDeleteConfirmDialog(onDelete: () => Promise<void>) {
  return useDialog({
    title: "Delete",
    subtitle: "Are you sure? This action cannot be undone.",
    size: "sm",
    cancelButton: { label: "Cancel" },
    actionButton: {
      label: "Delete",
      variant: "destructive",
      onClick: onDelete,
    },
  });
}

// Usage
const dialog = useDeleteConfirmDialog(async () => {
  await deleteUser(userId);
});
```

### 2. **Error Handling**

Handle errors gracefully:

```tsx
const dialog = useDialog({
  actionButton: {
    label: "Save",
    onClick: async () => {
      try {
        await saveData();
        toast.success("Saved successfully!");
      } catch (error) {
        toast.error(error.message);
        // Dialog stays open, user can retry
      }
    },
  },
});
```

### 3. **Loading Feedback**

Always provide loading feedback:

```tsx
const dialog = useDialog({
  actionButton: {
    label: "Uploading...",
    onClick: async () => {
      // Spinner shows automatically during upload
      await uploadFile();
      toast.success("Upload complete!");
    },
  },
});
```

### 4. **Disable Buttons While Loading**

Buttons are automatically disabled during loading:

```tsx
// This is handled automatically
// While loading is true, all buttons are disabled
// Spinner shows on action/middle buttons
```

### 5. **Type-Safe Config**

Always use TypeScript for type safety:

```tsx
import { DialogConfig } from "@/hooks/useDialog";

const config: DialogConfig = {
  title: "Confirm",
  size: "md",
  actionButton: {
    label: "Confirm",
    variant: "default",
    onClick: async () => {
      // Type-safe!
    },
  },
};

const dialog = useDialog(config);
```

---

## Complete Example

```tsx
"use client";

import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { toast } from "sonner";

export function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);

  // Delete dialog
  const deleteDialog = useDialog({
    title: "Delete User",
    subtitle: "This action cannot be undone.",
    size: "md",
    cancelButton: { label: "Cancel" },
    actionButton: {
      label: "Delete",
      variant: "destructive",
      onClick: async () => {
        // Simulated API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("User deleted");
      },
    },
  });

  // Edit dialog
  const [editUser, setEditUser] = useState<(typeof users)[0] | null>(null);
  const editDialog = useDialog({
    title: "Edit User",
    form: editUser && (
      <input
        type="text"
        defaultValue={editUser.name}
        className="w-full px-3 py-2 border rounded"
      />
    ),
    size: "lg",
    cancelButton: { label: "Cancel" },
    actionButton: {
      label: "Save",
      onClick: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success("User updated");
      },
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <span>{user.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditUser(user);
                  editDialog.openDialog();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={deleteDialog.openDialog}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Render dialogs */}
      {deleteDialog.dialog}
      {editDialog.dialog}
    </div>
  );
}
```

---

## Styling & Customization

### Theme Support

The dialog automatically adapts to light/dark themes:

```tsx
// Light mode: Light backgrounds, dark text
// Dark mode: Dark backgrounds, light text
// Automatic transition with next-themes
```

### Button Variants

Choose the appropriate variant for your action:

```tsx
// For confirmation
variant: "default";

// For deletion/destructive actions
variant: "destructive";

// For secondary actions
variant: "secondary";

// For alternate actions
variant: "outline";

// For subtle actions
variant: "ghost";
```

### Custom Styling

For custom styling, modify the DialogCreator component or use Tailwind classes on form content:

```tsx
form: <div className="space-y-4 bg-blue-50 dark:bg-blue-950 p-4 rounded">
  {/* Custom styled form */}
</div>;
```

---

## Troubleshooting

### Dialog Not Opening

- Make sure you're calling `dialog.openDialog()`
- Verify `{dialog.dialog}` is rendered in your JSX

### Loading State Not Updating

- Check if `onClick` handler is async
- For external loading, ensure you're setting the state in the parent

### Buttons Not Showing Spinner

- Only action and middle buttons show spinners
- Cancel button doesn't show spinner (it closes immediately)
- Ensure `onClick` is returning a Promise for automatic loading

### Dialog Closing Too Quickly

- The dialog has a 300ms animation delay before reset
- This is intentional for smooth transitions

---

## API Comparison

### Before (Manual Management)

```tsx
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const handleConfirm = async () => {
  setIsLoading(true);
  try {
    await action();
  } finally {
    setIsLoading(false);
    setIsOpen(false);
  }
};

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open</button>
    {isOpen && (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Complex dialog JSX */}
      </Dialog>
    )}
  </>
);
```

### After (With useDialog)

```tsx
const dialog = useDialog({
  actionButton: {
    label: "Confirm",
    onClick: async () => await action(),
  },
});

return (
  <>
    <button onClick={dialog.openDialog}>Open</button>
    {dialog.dialog}
  </>
);
```

**Benefits:**
✅ 60% less boilerplate  
✅ Declarative configuration  
✅ Automatic loading management  
✅ Type-safe API  
✅ Reusable across components

---

## Related Components

- **[DialogCreator](../components/DialogCreator.tsx)** - Core dialog component
- **[useDialog Hook](../hooks/useDialog.ts)** - Dialog state management hook
- **[Examples](../examples/dialog.tsx)** - Live examples with different configurations

---

## Support

For issues, questions, or feature requests:

1. Check this documentation
2. Review the [examples](../examples/dialog.tsx)
3. Open an issue on GitHub

---

**Last Updated:** November 21, 2025  
**Version:** 1.0.0
