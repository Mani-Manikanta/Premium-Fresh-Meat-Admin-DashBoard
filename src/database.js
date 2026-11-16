const DATABASE_NAME = "prime-cut-admin";
const DATABASE_VERSION = 2;
export const DEMO_USD_TO_INR = 88;

const starterProducts = [
  { id: "p-101", name: "Ribeye Steak", category: "Beef", cut: "Premium cut", price: 28.5, stock: 24, unit: "lb", status: "Fresh" },
  { id: "p-102", name: "Wagyu Ground Beef", category: "Beef", cut: "Ground", price: 18, stock: 8, unit: "lb", status: "Low stock" },
  { id: "p-103", name: "Lamb Chops", category: "Lamb", cut: "French-trimmed", price: 32, stock: 16, unit: "lb", status: "Fresh" },
  { id: "p-104", name: "Free-Range Chicken", category: "Poultry", cut: "Whole bird", price: 14.5, stock: 31, unit: "each", status: "Fresh" },
  { id: "p-105", name: "Pork Tenderloin", category: "Pork", cut: "Center-cut", price: 16, stock: 5, unit: "lb", status: "Low stock" },
  { id: "p-106", name: "New York Strip", category: "Beef", cut: "Dry-aged", price: 26, stock: 19, unit: "lb", status: "Fresh" },
  { id: "p-107", name: "Grass-Fed Sirloin", category: "Beef", cut: "Top sirloin", price: 21, stock: 12, unit: "lb", status: "Fresh" },
];

const starterOrders = [
  { id: "PC-2048", customer: "Olivia Bennett", items: 3, total: 86.5, status: "Preparing", time: "10:42 AM" },
  { id: "PC-2047", customer: "Ethan Parker", items: 2, total: 54, status: "Ready", time: "10:28 AM" },
  { id: "PC-2046", customer: "Mia Thompson", items: 5, total: 142.75, status: "Delivered", time: "10:05 AM" },
  { id: "PC-2045", customer: "Noah Williams", items: 1, total: 32, status: "Preparing", time: "9:48 AM" },
];

const starterCustomers = [
  { id: "c-101", name: "Olivia Bennett", email: "olivia.bennett@example.com", phone: "+91 90000 10001", orders: 18 },
  { id: "c-102", name: "Ethan Parker", email: "ethan.parker@example.com", phone: "+91 90000 10002", orders: 12 },
  { id: "c-103", name: "Mia Thompson", email: "mia.thompson@example.com", phone: "+91 90000 10003", orders: 9 },
  { id: "c-104", name: "Noah Williams", email: "noah.williams@example.com", phone: "+91 90000 10004", orders: 6 },
];

const starterSellers = [
  { id: "s-101", name: "Green Pastures Butchery", address: "12 Demo Market, T. Nagar, Chennai", email: "hello@greenpastures.example", phone: "+91 90000 20001", meatTypes: ["Beef", "Lamb"], revenue: 8420 },
  { id: "s-102", name: "The Sunday Roast", address: "8 Sample Road, Anna Nagar, Chennai", email: "orders@sundayroast.example", phone: "+91 90000 20002", meatTypes: ["Poultry", "Pork"], revenue: 6350 },
  { id: "s-103", name: "Hill Country Meats", address: "3 Market Lane, Adyar, Chennai", email: "shop@hillcountry.example", phone: "+91 90000 20003", meatTypes: ["Beef", "Pork", "Lamb"], revenue: 5120 },
];

const starterRiders = [
  { id: "r-101", name: "Arjun Kumar", licenceNumber: "DEMO-TN-000124", email: "arjun.kumar@example.com", phone: "+91 90000 30001", rides: 146, revenue: 420 },
  { id: "r-102", name: "Priya Nair", licenceNumber: "DEMO-TN-000257", email: "priya.nair@example.com", phone: "+91 90000 30002", rides: 121, revenue: 385 },
  { id: "r-103", name: "Ravi Menon", licenceNumber: "DEMO-TN-000389", email: "ravi.menon@example.com", phone: "+91 90000 30003", rides: 98, revenue: 310 },
];

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      ["products", "orders", "customers", "sellers", "riders", "settings"].forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open the local database."));
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("The local database request failed."));
  });
}

function transactionComplete(transaction, message) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error ?? new Error(message));
    transaction.onabort = () => reject(transaction.error ?? new Error(`${message} (transaction aborted)`));
  });
}

export async function getDashboardData() {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(
      ["products", "orders", "customers", "sellers", "riders", "settings"],
      "readwrite",
    );
    const completion = transactionComplete(transaction, "Could not initialize the local database.");
    const stores = {
      products: transaction.objectStore("products"),
      orders: transaction.objectStore("orders"),
      customers: transaction.objectStore("customers"),
      sellers: transaction.objectStore("sellers"),
      riders: transaction.objectStore("riders"),
      settings: transaction.objectStore("settings"),
    };
    const [savedProducts, savedOrders, savedCustomers, savedSellers, savedRiders, currencyMigration] = await Promise.all([
      requestResult(stores.products.getAll()),
      requestResult(stores.orders.getAll()),
      requestResult(stores.customers.getAll()),
      requestResult(stores.sellers.getAll()),
      requestResult(stores.riders.getAll()),
      requestResult(stores.settings.get("inr-migration-v2")),
    ]);

    const products = savedProducts.length ? savedProducts : starterProducts;
    const orders = savedOrders.length ? savedOrders : starterOrders;
    const customers = savedCustomers.length ? savedCustomers : starterCustomers;
    const sellers = savedSellers.length ? savedSellers : starterSellers;
    const riders = savedRiders.length ? savedRiders : starterRiders;

    if (!savedProducts.length) products.forEach((product) => stores.products.add(product));
    if (!savedOrders.length) orders.forEach((order) => stores.orders.add(order));
    if (!savedCustomers.length) customers.forEach((customer) => stores.customers.add(customer));
    if (!savedSellers.length) sellers.forEach((seller) => stores.sellers.add(seller));
    if (!savedRiders.length) riders.forEach((rider) => stores.riders.add(rider));

    if (!currencyMigration) {
      products.forEach((product) => {
        product.price = Math.round(product.price * DEMO_USD_TO_INR * 100) / 100;
        stores.products.put(product);
      });
      orders.forEach((order) => {
        order.total = Math.round(order.total * DEMO_USD_TO_INR * 100) / 100;
        stores.orders.put(order);
      });
      sellers.forEach((seller) => {
        seller.revenue = Math.round(seller.revenue * DEMO_USD_TO_INR * 100) / 100;
        stores.sellers.put(seller);
      });
      riders.forEach((rider) => {
        rider.revenue = Math.round(rider.revenue * DEMO_USD_TO_INR * 100) / 100;
        stores.riders.put(rider);
      });
      stores.settings.put({ id: "inr-migration-v2", rate: DEMO_USD_TO_INR });
    }

    await completion;
    return { products, orders, customers, sellers, riders };
  } finally {
    database.close();
  }
}

export async function saveProduct(product) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction("products", "readwrite");
    const completion = transactionComplete(transaction, "Could not save this product.");
    transaction.objectStore("products").put(product);
    await completion;
  } finally {
    database.close();
  }
}

export async function updateProductStock(productId, amount) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction("products", "readwrite");
    const completion = transactionComplete(transaction, "Could not update product stock.");
    const store = transaction.objectStore("products");
    const product = await requestResult(store.get(productId));
    if (!product) throw new Error("That product could not be found.");

    product.stock = Math.max(0, product.stock + amount);
    product.status = product.stock <= 8 ? "Low stock" : "Fresh";
    store.put(product);

    await completion;
    return product;
  } finally {
    database.close();
  }
}
