import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        customerName
        totalAmount
        status
      }
      errors
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
        email
      }
      token
      errors
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    registerUser(email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      user {
        id
        email
      }
      token
      errors
    }
  }
`;

export const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      adminUser {
        id
        email
      }
      token
      errors
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      product {
        name
        description
        sku
        price
        stockQuantity
        images
        category {
          name
        }
      }
      errors
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdateInput!) {
    updateProduct(input: $input) {
      product {
        id
        name
        description
        sku
        price
        stockQuantity
        images
        imageIds
      }
      errors
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      errors
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      order {
        id
        status
      }
      errors
    }
  }
`;

export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($orderId: ID!, $status: String!) {
    updatePaymentStatus(orderId: $orderId, status: $status) {
      payment {
        id
        status
      }
      errors
    }
  }
`;

export const UPDATE_STORE_SETTINGS = gql`
  mutation UpdateStoreSettings($input: StoreSettingsInput!) {
    updateStoreSettings(input: $input) {
      storeSettings {
        id
        storeName
        primaryColor
        secondaryColor
        currencySymbol
        bankAccountName
        bankAccountNumber
        bankName
      }
      errors
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $description: String) {
    createCategory(name: $name, description: $description) {
      category {
        id
        name
        description
      }
      errors
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String, $description: String) {
    updateCategory(id: $id, name: $name, description: $description) {
      category {
        id
        name
        description
      }
      errors
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      errors
    }
  }
`;

export const CREATE_DIRECT_UPLOAD = gql`
  mutation CreateDirectUpload($input: CreateDirectUploadInput!) {
    createDirectUpload(input: $input) {
      directUpload {
        directUploadUrl
        signedBlobId
        uploadHeaders
      }
      errors
    }
  }
`;
