import { gql } from '@apollo/client';

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
      customerAddress
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
      status
      totalAmount
      createdAt
      payment {
        paymentMethod
        status
      }
    }
  }
`;

