import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        customerName
        totalAmount
        state
        fulfillmentStatus
        paymentStatus
      }
      accessToken
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

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      order {
        id
        state
        fulfillmentStatus
        paymentStatus
        availableStateEvents
        availableFulfillmentEvents
        availablePaymentEvents
      }
      errors
    }
  }
`;

export const ARCHIVE_ORDER = gql`
  mutation ArchiveOrder($id: ID!) {
    archiveOrder(id: $id) {
      order {
        id
        state
        availableStateEvents
      }
      errors
    }
  }
`;

export const UNARCHIVE_ORDER = gql`
  mutation UnarchiveOrder($id: ID!) {
    archiveOrder(id: $id) {
      order {
        id
        state
        availableStateEvents
      }
      errors
    }
  }
`;

export const TRANSITION_FULFILLMENT_STATUS = gql`
  mutation TransitionFulfillmentStatus($id: ID!, $event: String!) {
    transitionFulfillmentStatus(id: $id, event: $event) {
      order {
        id
        fulfillmentStatus
        paymentStatus
        payment {
          id
          status
          paymentMethod
        }
        availableFulfillmentEvents
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
        selectedTheme
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

export const CREATE_BANK_ACCOUNT = gql`
  mutation CreateBankAccount($bankName: String!, $accountName: String!, $accountNumber: String!, $isActive: Boolean) {
    createBankAccount(bankName: $bankName, accountName: $accountName, accountNumber: $accountNumber, isActive: $isActive) {
      bankAccount {
        id
        bankName
        accountName
        accountNumber
        isActive
      }
      errors
    }
  }
`;

export const UPDATE_BANK_ACCOUNT = gql`
  mutation UpdateBankAccount($id: ID!, $bankName: String, $accountName: String, $accountNumber: String, $isActive: Boolean) {
    updateBankAccount(id: $id, bankName: $bankName, accountName: $accountName, accountNumber: $accountNumber, isActive: $isActive) {
      bankAccount {
        id
        bankName
        accountName
        accountNumber
        isActive
      }
      errors
    }
  }
`;

export const DELETE_BANK_ACCOUNT = gql`
  mutation DeleteBankAccount($id: ID!) {
    deleteBankAccount(id: $id) {
      id
      errors
    }
  }
`;
