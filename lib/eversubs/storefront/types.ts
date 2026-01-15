/**
 * First line of the address
 */
export type Address1 = string | null;

/**
 * Second line of the address
 */
export type Address2 = string | null;

/**
 * ZIP code
 */
export type Zip = string | null;

/**
 * City
 */
export type City = string | null;

/**
 * Company name
 */
export type Company = string | null;

/**
 * Country
 */
export type Country = string | null;

/**
 * Country code
 */
export type CountryCode = string | null;

/**
 * Province code. For some countries this is mandatory when creating a contract
 */
export type ProvinceCode = string | null;

/**
 * First name
 */
export type FirstName = string | null;

/**
 * Last name
 */
export type LastName = string | null;

/**
 * Full name
 */
export type Name = string | null;

/**
 * Value Type
 */
export type ValueType = "PERCENTAGE" | "FIXED";

/**
 * the shopify GID of the discount
 */
export type Id = string;

/**
 * Rejection reason if the discount is not valid anymore.
 */
export type RejectionReason = string | null;

/**
 * type of the discount. Can be AUTOMATIC_DISCOUNT, CODE_DISCOUNT or MANUAL
 */
export type Type = string;

/**
 * TRUE=discount is still active, FALSE=discount is not active anymore.
 */
export type IsActive = boolean;

/**
 * Title of the discount
 */
export type Title = string;

/**
 * Number of times the discount has already been applied on recurring orders
 */
export type UsageCount = number;

/**
 * for percentage discounts -> value between 1-100, for fixed discounts = discount amount
 */
export type Value = number;

/**
 * the shopify GID of the line of the contract.
 */
export type Id1 = string;

/**
 * the title of the line of the contract item
 */
export type Title1 = string;

/**
 * The title of the variant
 */
export type VariantTitle = string | null;

/**
 * Link to the image of the variant
 */
export type VariantImage = string | null;

/**
 * key of the custom attribute. e.g. one_time_add_on
 */
export type Key = string | null;

/**
 * value of the custom attribute. e.g. TRUE/FALSE
 */
export type Value1 = string | null;

/**
 * Discount title that was setup in eversubs admin
 */
export type Title2 = string | null;

/**
 * Discount description that was setup in eversubs admin
 */
export type Description = string | null;

/**
 * accepted values: ORDER, PRODUCT, SHIPPING
 */
export type DiscountClasses = string[] | null;

/**
 * whether there is any active step on the discount
 */
export type IsActive1 = boolean;

/**
 * the shopify GID of the customer associated with the contract.
 */
export type Id2 = string;

/**
 * email of customer
 */
export type Email = string | null;

/**
 * first name of customer
 */
export type FirstName1 = string | null;

/**
 * whether or not customer has bundling enabled. This will only be false if customer or customer support agent sets this metafield
 */
export type AutomaticallyBundleSubscriptions = boolean | null;

/**
 * The name of the payment instrument
 */
export type Name1 = string | null;

/**
 * If paypal is the instrument, paypal email.
 */
export type PaypalAccountEmail = string | null;

/**
 * The masked number of the card if it is card payment.
 */
export type MaskedNumber = string | null;

/**
 * The frequency, it can be either: DAY, WEEK, MONTH or YEAR.
 */
export type Interval = string;

/**
 * The number of intervals between each step in the given interval unit.
 */
export type IntervalCount = number;

/**
 * only apply discount if order value exceeds minimum order value.
 */
export type MinimumOrderValue = MinumumOrderValue | null;

/**
 * List of collection ids that the discount should be applied to
 */
export type ApplyToCollections = string[] | null;

/**
 * List of collection ids that the discount should be applied to
 */
export type ApplyToProducts = string[] | null;

/**
 * List of collection ids that the discount should be applied to
 */
export type ApplyToProductVariants = string[] | null;

/**
 * List of product ids that need to be present to apply the discount
 */
export type MustIncludeProducts = string[] | null;

/**
 * Step
 */
export type Step = number;

/**
 * Recurring Cycle Limit
 */
export type RecurringCycleLimit = number;

/**
 * Usage Count
 */
export type UsageCount1 = number;

/**
 * Rejection Reason
 */
export type RejectionReason1 = string | null;

/**
 * whether this step is active
 */
export type IsActive2 = boolean;

/**
 * Amount
 */
export type Amount = number;

/**
 * Currency
 */
export type Currency = string;

/**
 * List of subscriptions.
 */
export type Subscriptions = SubscriptionContractFull[];

/**
 * Next cursor for paginated results
 */
export type NextCursor = string | null;

/**
 * The id of the subscription to pause
 */
export type SubscriptionId = string;

/**
 * The id of the line item to pause. If not provided, pauses the entire contract
 */
export type LineItemId = string | null;

/**
 * The reason for pausing the subscription
 */
export type Reason = string;

/**
 * Additional details about the cancellation reason
 */
export type OtherCancellationReason = string | null;

/**
 * The new quantity for the line. If its empty quantity wont be changed.
 */
export type Quantity = number | null;

/**
 * The new variant id for the line. If its empty variant wont be changed.
 */
export type VariantId = string | null;

/**
 * Additional details about the cancellation reason
 */
export type NextBillingDate = string;

/**
 * the shopify GID of the contract.
 */
export type Id3 = string;

/**
 * the date where the contract is next to be billed
 */
export type NextBillingDate1 = string;

/**
 * Revision id indicates a version of the contract, it's increasing but not necessarily every number is being used
 */
export type RevisionId = number;

/**
 * The datetime, when the contract was last updated
 */
export type UpdatedAt = string;

/**
 * The datetime, when the contract was created
 */
export type CreatedAt = string;

/**
 * The original checkout order that the contract has been created through. This is only correct for the contracts that have been created through eversubs.
 */
export type OriginOrderId = string | null;

/**
 * The status of the contract.
 */
export type Status =
  | "ACTIVE"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED"
  | "PAUSED"
  | "STALE"
  | null;

/**
 * Location
 */
export type Loc = (string | number)[];

/**
 * Message
 */
export type Msg = string;

/**
 * Error Type
 */
export type Type1 = string;

/**
 * Message
 */
export type Message = string;

/**
 * Subscriptions
 */
export type SubscriptionResponseSubscription = SubscriptionContractFull;

/**
 * Customer subscription management
 */
export type Tag = string;

/**
 * Address
 *
 * Shipping address information.
 */
export interface Address {
  address1?: Address1;
  address2?: Address2;
  zip?: Zip;
  city?: City;
  company?: Company;
  country?: Country;
  country_code?: CountryCode;
  province_code?: ProvinceCode;
  first_name?: FirstName;
  last_name?: LastName;
  name?: Name;
}

/**
 * BaseCustomDiscount
 *
 * Base model for custom discounts.
 */
export interface BaseCustomDiscount {
  title: string;
  value: number;
  value_type: ValueType;
  once_per_order?: boolean;
  conditions?: DiscountConditions | null;
}

/**
 * BasicBillingAttempt
 *
 * Basic billing attempt info about creation.
 */
export interface BasicBillingAttempt {
  /**
   * Date that the billing attempt was created at.
   */
  created_at: string;
}

/**
 * BillingPolicy
 *
 * Billing policy with interval and frequency.
 */
export interface BillingPolicy {
  /**
   * The frequency, it can be either: DAY, WEEK, MONTH or YEAR.
   */
  interval: string;
  /**
   * The number of intervals between each step in the given interval unit.
   */
  interval_count: number;
}

/**
 * ContractDiscounts
 *
 * Contract-specific discount information.
 */
export interface ContractDiscounts {
  /**
   * Shopify GID of the discount
   */
  id: Id;
  /**
   * Number of times the discount can be applied on recurring orders
   */
  recurring_cycle_limit?: number | null;
  /**
   * Rejection reason if the discount is not valid anymore.
   */
  rejection_reason?: RejectionReason;
  /**
   * type of the discount. Can be AUTOMATIC_DISCOUNT, CODE_DISCOUNT or MANUAL
   */
  type: Type;
  /**
   * TRUE=discount is still active, FALSE=discount is not active anymore.
   */
  is_active: IsActive;
  /**
   * Title of the discount
   */
  title: Title;
  /**
   * Number of times the discount has already been applied on recurring orders
   */
  usage_count: UsageCount;
  /**
   * for percentage discounts -> value between 1-100, for fixed discounts = discount amount
   */
  value: Value;
  value_type: ValueType;
}

/**
 * ContractLine
 *
 * Product line item within a subscription contract.
 *
 * Represents a single product/variant that's part of a subscription.
 * Extends Product with:
 * - Line item ID for contract management
 * - Title for display
 * - Custom attributes for metadata
 * - Current pricing for billing
 *
 * Used in SubscriptionContractWithLines for tracking all products
 * in a customer's subscription.
 */
export interface ContractLine {
  /**
   * Shopify GID of the product. e.g. gid://shopify/Product/XXX
   */
  product_id?: string | null;
  /**
   * Shopify GID of the variant. e.g. gid://shopify/ProductVariant/XXX
   */
  variant_id?: string | null;
  /**
   * Ordered quantity of the product.
   */
  quantity?: number | null;
  /**
   * Discounted price of the line
   */
  line_discounted_price?: Price | null;
  /**
   * the shopify GID of the line of the contract.
   */
  id: Id1;
  /**
   * the title of the line of the contract item
   */
  title: Title1;
  /**
   * Custom attributes of the contract item
   */
  custom_attributes?: CustomAttribute[] | null;
  /**
   * Current price of the contract item
   */
  current_price?: Price | null;
  /**
   * The title of the variant
   */
  variant_title?: VariantTitle;
  /**
   * Link to the image of the variant
   */
  variant_image?: VariantImage;
}

/**
 * CustomAttribute
 *
 * Custom attribute for line items and contracts.
 */
export interface CustomAttribute {
  /**
   * key of the custom attribute. e.g. one_time_add_on
   */
  key: Key;
  /**
   * value of the custom attribute. e.g. TRUE/FALSE
   */
  value: Value1;
}

/**
 * CustomDiscount
 *
 * Represents a complete discount sequence.
 *
 * It automatically sorts steps before validation, making it robust against unordered input.
 */
export interface CustomDiscount {
  /**
   * shopify GID of the discount that the custom discount config belongs to
   */
  discount_id?: string | null;
  /**
   * Discount title that was setup in eversubs admin
   */
  title?: Title2;
  /**
   * Discount description that was setup in eversubs admin
   */
  description?: Description;
  /**
   * accepted values: ORDER, PRODUCT, SHIPPING
   */
  discount_classes?: DiscountClasses;
  /**
   * accepted values: ORDER, PRODUCT, SHIPPING
   */
  initial_discount?: BaseCustomDiscount | null;
  steps: DiscountStep[];
  /**
   * whether there is any active step on the discount
   */
  is_active?: IsActive1;
}

/**
 * Customer
 *
 * Customer model with extended information including discounts and bundling preferences.
 */
export interface Customer {
  /**
   * the shopify GID of the customer associated with the contract.
   */
  id: Id2;
  /**
   * email of customer
   */
  email?: Email;
  /**
   * first name of customer
   */
  first_name?: FirstName1;
  /**
   * whether or not customer has bundling enabled. This will only be false if customer or customer support agent sets this metafield
   */
  automatically_bundle_subscriptions?: AutomaticallyBundleSubscriptions;
  /**
   * Manual discounts on the customer that will be applied to subscription orders if valid
   */
  customer_discounts?: CustomDiscount[] | null;
}

/**
 * CustomerPaymentMethod
 *
 * Customer payment method information.
 */
export interface CustomerPaymentMethod {
  /**
   * the shopify GID of the customer payment method.
   */
  id?: string | null;
  /**
   * Details about the payment method
   */
  instrument?: PaymentInstrument | null;
}

/**
 * DeliveryMethod
 *
 * Delivery method with address and title.
 */
export interface DeliveryMethod {
  /**
   * Shipping delivery method
   */
  address?: Address | null;
  /**
   * Title of the delivery method. e.g. Kostenloser Versand / Standard Shipping
   */
  title?: string | null;
}

/**
 * DeliveryPolicy
 *
 * Delivery policy with interval and frequency.
 */
export interface DeliveryPolicy {
  /**
   * The frequency, it can be either: DAY, WEEK, MONTH or YEAR.
   */
  interval: Interval;
  /**
   * The number of intervals between each step in the given interval unit.
   */
  interval_count: IntervalCount;
}

/**
 * DiscountConditions
 *
 * Conditions for applying discounts.
 */
export interface DiscountConditions {
  /**
   * only apply discount if order value exceeds minimum order value.
   */
  minimum_order_value?: MinimumOrderValue;
  /**
   * List of collection ids that the discount should be applied to
   */
  apply_to_collections?: ApplyToCollections;
  /**
   * List of collection ids that the discount should be applied to
   */
  apply_to_products?: ApplyToProducts;
  /**
   * List of collection ids that the discount should be applied to
   */
  apply_to_product_variants?: ApplyToProductVariants;
  /**
   * List of product ids that need to be present to apply the discount
   */
  must_include_products?: MustIncludeProducts;
}

/**
 * DiscountStep
 *
 * Discount step for progressive discounts.
 */
export interface DiscountStep {
  title: string;
  value: number;
  value_type: ValueType;
  once_per_order?: boolean;
  conditions?: DiscountConditions | null;
  step: Step;
  recurring_cycle_limit: RecurringCycleLimit;
  usage_count?: UsageCount1;
  rejection_reason?: RejectionReason1;
  /**
   * whether this step is active
   */
  is_active?: IsActive2;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

/**
 * MinumumOrderValue
 *
 * Minimum order value for discount conditions.
 */
export interface MinumumOrderValue {
  amount: Amount;
  currency: Currency;
}

/**
 * MultipleSubscriptionResponse
 *
 * Response model for multiple subscription operations.
 */
export interface MultipleSubscriptionResponse {
  /**
   * List of subscriptions.
   */
  subscriptions?: Subscriptions;
  /**
   * Next cursor for paginated results
   */
  next_cursor?: NextCursor;
  message: string;
}

/**
 * PaymentInstrument
 *
 * Payment instrument infos. Differs between paypal, card and shop pay.
 */
export interface PaymentInstrument {
  /**
   * The name of the payment instrument
   */
  name?: Name1;
  /**
   * If paypal is the instrument, paypal email.
   */
  paypal_account_email?: PaypalAccountEmail;
  /**
   * The masked number of the card if it is card payment.
   */
  masked_number?: MaskedNumber;
}

/**
 * Price
 *
 * Price information with currency and amount.
 */
export interface Price {
  /**
   * Currency code for the price
   */
  currency_code: string;
  /**
   * Amount of the price
   */
  amount: number;
}

/**
 * StorefrontChangeProductRequest
 *
 * Request model for changing a product of a subscription from storefront.
 */
export interface StorefrontChangeProductRequest {
  /**
   * The id of the subscription to pause
   */
  subscription_id: SubscriptionId;
  /**
   * The line item to change.
   */
  line_item_id: string;
  /**
   * The new quantity for the line. If its empty quantity wont be changed.
   */
  quantity?: Quantity;
  /**
   * The new variant id for the line. If its empty variant wont be changed.
   */
  variant_id?: VariantId;
}

/**
 * StorefrontPauseRequest
 *
 * Request model for pausing a subscription from storefront.
 */
export interface StorefrontPauseRequest {
  /**
   * The id of the subscription to pause
   */
  subscription_id: SubscriptionId;
  /**
   * The id of the line item to pause. If not provided, pauses the entire contract
   */
  line_item_id?: LineItemId;
  /**
   * The reason for pausing the subscription
   */
  reason: Reason;
  /**
   * Additional details about the cancellation reason
   */
  other_cancellation_reason?: OtherCancellationReason;
}

/**
 * StorefrontResumeRequest
 *
 * Request model for resuming a subscription from storefront.
 */
export interface StorefrontResumeRequest {
  /**
   * The id of the subscription to resume
   */
  subscription_id: SubscriptionId;
}

/**
 * StorefrontSetNextBillingDateRequest
 *
 * Request model for changing a next billing date of a subscription from storefront.
 */
export interface StorefrontSetNextBillingDateRequest {
  /**
   * The id of the subscription to pause
   */
  subscription_id: SubscriptionId;
  /**
   * The line item to change next billing date. If not provided the entire contract will be changed.
   */
  line_item_id?: LineItemId;
  /**
   * Additional details about the cancellation reason
   */
  next_billing_date: NextBillingDate;
}

/**
 * SubscriptionContractFull
 *
 * Full subscription contract with all fields.
 */
export interface SubscriptionContractFull {
  /**
   * the shopify GID of the contract.
   */
  id: Id3;
  /**
   * the date where the contract is next to be billed
   */
  next_billing_date: NextBillingDate1;
  /**
   * Billing policy of the contract
   */
  billing_policy: BillingPolicy | null;
  /**
   * customer data
   */
  customer: Customer;
  /**
   * The lines of the contract (the first one is the original contract item. the following ones are either concatenated items or one time add ons
   */
  lines: ContractLine[];
  /**
   * Payment method of the customer
   */
  customer_payment_method?: CustomerPaymentMethod | null;
  /**
   * All billing attempts attached to the contract.
   */
  billing_attempts?: BasicBillingAttempt[];
  /**
   * Delivery policy of the contract
   */
  delivery_policy: DeliveryPolicy;
  /**
   * Custom attributes of the contract
   */
  custom_attributes?: CustomAttribute[] | null;
  /**
   * Delivery method of the contract
   */
  delivery_method: DeliveryMethod;
  /**
   * The delivery price for each billing of the subscription contract.
   */
  delivery_price: Price | null;
  /**
   * List of discounts on the contract. If they have a rejection reason will no longer be applied
   */
  discounts?: ContractDiscounts[] | null;
  /**
   * Revision id indicates a version of the contract, it's increasing but not necessarily every number is being used
   */
  revision_id: RevisionId;
  /**
   * The datetime, when the contract was last updated
   */
  updated_at: UpdatedAt;
  /**
   * The datetime, when the contract was created
   */
  created_at: CreatedAt;
  /**
   * The original checkout order that the contract has been created through. This is only correct for the contracts that have been created through eversubs.
   */
  origin_order_id?: OriginOrderId;
  /**
   * The status of the contract.
   */
  status?: Status;
}

/**
 * SubscriptionResponse
 *
 * Response model for subscription operations.
 */
export interface SubscriptionResponse {
  subscription: SubscriptionResponseSubscription;
  message: string;
}

export interface ValidationError {
  loc: Loc;
  msg: Msg;
  type: Type1;
}
