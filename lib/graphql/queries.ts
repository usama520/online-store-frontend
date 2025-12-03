import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($categoryId: ID, $search: String) {
    products(categoryId: $categoryId, search: $search) {
      id
      name
      description
      price
      sku
      stockQuantity
      images
      imageIds
      inStock
      category {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      sku
      stockQuantity
      images
      imageIds
      inStock
      category {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
    }
  }
`;

export const GET_STORE_SETTINGS = gql`
  query GetStoreSettings {
    storeSettings {
      id
      storeName
      logoUrl
      primaryColor
      secondaryColor
      currencySymbol
      bankAccountName
      bankAccountNumber
      bankName
      contactEmail
      contactPhone
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      customerName
      customerEmail
      customerPhone
      streetAddress
      city
      postalCode
      status
      totalAmount
      createdAt
      orderItems {
        id
        quantity
        price
        subtotal
        product {
          id
          name
          images
        }
      }
      payment {
        id
        paymentMethod
        status
        amount
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      customerName
      customerEmail
      customerPhone
      streetAddress
      city
      postalCode
      status
      totalAmount
      createdAt
      orderItems {
        id
        quantity
        price
        subtotal
        product {
          id
          name
        }
      }
      payment {
        id
        paymentMethod
        status
      }
    }
  }
`;
