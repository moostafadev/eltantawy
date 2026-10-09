# Reusable UI Components

This directory contains shared UI components used across the application.
Components are grouped by feature and can be imported from their directory
barrels, for example:

```tsx
import { Button } from "@/components/button";
import { Card } from "@/components/card";
```

## Application setup

- Mount `ToastProvider` once above components that call `useToast()`. The root
  layout already provides it.
- Mount `DialogProvider` above components that call `useDialog()`.
- Use `Form` as the parent of form-connected fields such as `Input`, `Select`,
  `Switch`, and `ImageInput`.

## Components

### Actions and status

#### `Button`

Shared button built on the native `<button>` element, so standard button
attributes and event handlers are supported. It accepts `color`, `variant`,
`size`, `loading`, and `selected`. The `loading` state disables the button and
replaces its children with a spinner. Use `variant="card"` with `selected` for
a selectable card-style choice.

```tsx
<Button type="submit" color="SUCCESS" loading={isSaving}>
  Save
</Button>
```

#### `LogoutButton`

Logs out through `AuthContext`, displays a toast, and navigates to the home
page. Accepts button color, size, and children to customize its label. It must
render under the authentication and toast providers.

#### `Tag`

Small status or label pill. Accepts children, a shared theme `color`, a
`solid`, `soft`, or `outline` variant, and an `xs`, `sm`, or `md` size.

### Layout and navigation

#### `Card`

Bordered surface for grouping content. Accepts children, a `className`, and
standard `<div>` attributes.

#### `Breadcrumb`

Renders a home link followed by the supplied `items`. Each item has a
`label` and may include an `icon` and `href`. The final item represents the
current page and is not rendered as a link.

```tsx
<Breadcrumb
  items={[
    { label: "Products", href: "/admin/products" },
    { label: "Create product" },
  ]}
/>
```

#### `Accordion`, `AccordionItem`, and `useAccordion`

`Accordion` manages open-item state for its descendant `AccordionItem`
components. Only one item may be open by default; set `allowMultiple` to allow
several. Use each item's unique `value` to identify it, `trigger` for its
always-visible heading, and `children` for its expandable content.
`defaultOpenValue` opens one item initially when multiple items are disabled.
`useAccordion` exposes `openValues`, `toggle`, and `isOpen` to descendants and
throws when called outside an accordion.

#### `Carousel` and `CarouselItem`

Horizontal RTL carousel with optional controls, autoplay, hover pausing, and
looping. `showArrows` defaults to `true`; autoplay defaults to `false`, with
an interval of 4000 ms when enabled. `CarouselItem` supplies responsive item
widths; pass the items as children of `Carousel`.

```tsx
<Carousel autoPlay pauseOnHover loop>
  {products.map((product) => (
    <CarouselItem key={product.id}>
      <ProductCard product={product} />
    </CarouselItem>
  ))}
</Carousel>
```

#### `Table`

Generic data table parameterized by the row type. Supply `data` and
`columns`; each column has a `key` and `title`, and may provide a `render`
callback for custom cell content. `loading` displays skeleton rows,
`loadingRows` controls their count, and `emptyMessage` is shown when there are
no rows.

#### `LoadingImage`

Wraps Next.js `Image` and accepts its normal `ImageProps`. It defaults to a
blur placeholder and provides a built-in shimmer image when no blur data URL
is supplied.

### Forms

#### `Form`

Typed wrapper around `react-hook-form`. It accepts the standard `useForm`
options, an `onSubmit` handler, children, and an optional `onFormReady`
callback. Nested fields read and update the form state by their `name`.

```tsx
type LoginValues = { email: string };

<Form<LoginValues>
  defaultValues={{ email: "" }}
  onSubmit={(values) => save(values)}
>
  <Input<LoginValues> name="email" label="Email" />
  <Button type="submit">Continue</Button>
</Form>
```

#### `Input`

Text field connected to the nearest `Form`. The `name` must be a valid path
in the form value type. Password fields include a visibility toggle, telephone
fields remove non-digits, and number fields allow a leading minus sign and a
single decimal point.

#### `Select`

Custom dropdown connected to the nearest `Form`. Provide `options` as
`{ value, label }` entries. It closes when clicking outside and optionally
calls `onValueChange` after updating the form field.

#### `Switch`

Use as a controlled switch by supplying `checked` and optionally
`onCheckedChange`/`onValueChange`, or connect it to `Form` with `name` and
without `checked`. The form-connected mode requires a `Form` ancestor.

#### `ImageInput`

Image upload field connected to the nearest `Form`. It validates that the
selected file is an image no larger than 5 MB, uploads it to
`/api/upload/image`, and stores the returned URL in the named form field.

### Feedback and loading

#### `DialogProvider` and `useDialog`

`DialogProvider` manages one global dialog for its subtree. Call
`useDialog().openDialog({ title, size, children })` to open it and
`closeDialog()` to dismiss it. Supported sizes are `md`, `lg`, and `xl`.
`useDialog` must be called below a `DialogProvider`.

```tsx
const { openDialog, closeDialog } = useDialog();

openDialog({
  title: "Confirm delete",
  size: "md",
  children: <ConfirmDelete onCancel={closeDialog} />,
});
```

#### `ToastProvider` and `useToast`

`ToastProvider` renders and manages toast notifications for its subtree. Call
`useToast()` to access `toast.success`, `toast.error`, `toast.warning`,
`toast.info`, or `toast.loading`. The first four accept an optional duration
in milliseconds and default to four seconds.

```tsx
const { toast } = useToast();

toast.success("Saved successfully.");
toast.error("The request could not be completed.");
```

Loading toasts do not expire automatically. Note that `toast.loading` does
not return an ID, so its caller cannot pass that toast to `removeToast(id)`.

The provider renders its toast list itself. Application code should use
`useToast()` rather than mounting the exported `Toaster` renderer directly.

#### `Skeleton`

Pulsing placeholder block. `width` is specified in pixels and defaults to
100%; `height` defaults to 16 pixels. Use `count` for repeated blocks or
`aspectRatio` for a responsive aspect-ratio placeholder.

#### Page loading components

Import page-shaped loading placeholders from `@/components/loading`. The
barrel exports `AdminTableLoading`, `AdminFormLoading`,
`AdminDetailLoading`, `AdminCategoryDetailLoading`, `AdminOrderLoading`,
`AdminRecordLoading`, `AdminSettingsLoading`, `AdminUserLoading`,
`ClientCartLoading`, `ClientCatalogLoading`, `ClientCategoriesLoading`,
`ClientCheckoutLoading`, `ClientOffersLoading`, `ClientOrdersLoading`,
`ClientProductLoading`, and `ClientProfileLoading`.

#### `Spin`

Standalone SVG loading indicator with a configurable `size` and standard SVG
attributes. Import it from `@/components/icons/Spin`.

### Structured data

#### `StructuredData`

Renders one JSON-LD object or an array of JSON-LD objects as
`application/ld+json` script elements. Use it with the data builders in
`@/lib/seo/structuredData`.
