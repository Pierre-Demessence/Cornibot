import "@typegoose/typegoose";

declare module "@typegoose/typegoose/lib/types" {
  export interface BasePropOptions {
    /**
     * True if modifying this property shouldn't not update the updatedAt property managed by the `ConditionalTimestamps` class.
     */
    bypassUpdatedAt?: boolean;
    /**
     * See https://florianholzapfel.github.io/express-restify-mongoose/#access
     */
    access?: "private" | "protected" | "public";
  }
}
