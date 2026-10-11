import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import CloseIcon from "../../../public/assets/icons/close.svg";

import { cn } from "@/lib/utils";

// A bottom sheet (Vaul, built on Radix Dialog): drag down or flick to
// dismiss. Vaul animates it with its own iOS-like curve,
// cubic-bezier(0.32, 0.72, 0, 1), and locks page scroll while open.

const Drawer = DrawerPrimitive.Root;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Clears the home indicator; dvh so the sheet never runs under the
        // browser's toolbar.
        "fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[calc(100vh-2rem)] supports-[max-height:100dvh]:max-h-[calc(100dvh-2rem)] rounded-t-xl bg-white outline-none",
        "pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]",
        className
      )}
      {...props}
    >
      {/* The grab handle: a visual cue for dragging, not a control. */}
      <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-grey-300" />
      {children}
      <DrawerPrimitive.Close className="absolute right-5 top-7 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <CloseIcon />
        <span className="sr-only">Close</span>
      </DrawerPrimitive.Close>
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerTitle = DrawerPrimitive.Title;
const DrawerDescription = DrawerPrimitive.Description;

export { Drawer, DrawerContent, DrawerTitle, DrawerDescription };
