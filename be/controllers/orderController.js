import orderModel from "../models/orderModel.js";
import {
  deductOrderedItemsFromStock,
  addOrderedItemsToStock,
} from "./foodController.js";
import { removeOrderedItemFromCart } from "./cartController.js";
import { deleteDelivery } from "./deliveryController.js";

// * for algorithm
import { Apriori } from "node-apriori";

const requestOrder = async (req, res) => {
  try {
    console.log("request for order received!");
    console.log("current user id : ", req.userId);

    const { orderedItems, totalOrderedPrice, date } = req.body;

    console.log(req.body);

    // * check if required fields are present
    if (!orderedItems || !totalOrderedPrice || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Missing one/all required fields (orderedItems, totalPrice, date)!",
      });
    }

    const newRequestOrder = new orderModel({
      userId: req.userId,
      totalOrderedPrice,
      date,
      status: "Pending",
      orderedItems,
    });

    let response = await newRequestOrder.save();
    if (response) {
      // * if request order has been saved
      // * deduct the quantity on the stocks available
      let result = deductOrderedItemsFromStock(orderedItems);
      if (result) {
        console.log("ITEM STOCK UPDATED!");
        result = removeOrderedItemFromCart(orderedItems, req.userId);
        if (result) {
          console.log("USER CART UPDATED!");
        } else {
          console.log("THERE IS A PROBLEM REMOVING ITEM FROM CART!");
          res.status(500).json({
            success: false,
            message: "THERE IS A PROBLEM REMOVING ITEM FROM CART!",
          });
        }
      } else {
        console.log("THERE IS A PROBLEM UPDATING STOCK!");
        res.status(500).json({
          success: false,
          message: "THERE IS A PROBLEM UPDATING STOCK!",
        });
      }
      // * if all process succeed
      res.json({
        success: true,
        message: "Request order success!",
        orderId: newRequestOrder._id,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { date, status, id } = req.query;

    console.log("getting orders...");

    let query = {};

    if (date) {
      query.date = date;
    }
    if (status) {
      query.status = status;
    }
    if (id) {
      query._id =  id;
    }

    console.log(query);

    if (!date && !status && !id) {
      const orders = await orderModel.find({});
      return res.json({
        success: true,
        message: "Getting Order Success!",
        orders,
      });
    }

    const orders = await orderModel.find(query);
    res.json({ success: true, message: "Getting Order Success!", orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const updateOrder = async (req, res) => {
  try {
    console.log("updating order...");

    const { orderId, orderStatus, orderedItems } = req.body;

    // * check if required fields are present
    if (!orderId || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Missing one/all required fields (orderId, orderStatus)!",
      });
    }

    const result = await orderModel.findByIdAndUpdate(orderId, {
      status: orderStatus,
    });

    if (result) {
      // * transfer back the quantity on the stocks
      if (
        ((result.status === "Approved" || result.status === "Pending") &&
          orderStatus === "Rejected") ||
        orderStatus === "Cancelled"
      ) {
        let result = addOrderedItemsToStock(orderedItems);
        if (result) {
          console.log("ITEM STOCK UPDATED!");
        }
      }

      res.json({ success: true, message: "Order status updated!" });
    } else {
      res.json({ success: false, message: "Cannot update status!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    console.log("deleting order...");

    const { orderId } = req.body;

    // * check if required fields are present
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing one/all required fields (orderId)!",
      });
    }

    let result = await orderModel.findByIdAndDelete(orderId);

    if (result) {
      // * delete also the delivery information
      result = await deleteDelivery(orderId);
      if (result) {
        res.json({ success: true, message: "Order deleted!" });
      } else {
        res.json({ success: false, message: "Cannot delete order!" });
      }
    } else {
      res.json({ success: false, message: "Cannot delete order!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const getUserOrder = async (req, res) => {
  try {
    const userType = req.query.userType;

    console.log("getting 1 user...");
    console.log("USER : ", req.userId);
    console.log("TYPE : ", userType);
    let orders = await orderModel.find({ userId: req.userId });

    res.json({ success: true, message: "Getting User Success!", orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const runApriori = async (req, res) => {
  try {
    console.log("getting all orders...");
    const orders = await orderModel.find({});

    // * FOR ALGO
    let transactions = [];
    orders.forEach((order) => {
      let transaction = order.orderedItems.map((item) => item.food);
      transactions.push(transaction);
    });

    let promotionWithConfidence = await runAlgorithm(transactions);

    // promotionWithConfidence.frequentItemsForPromotion =
    //   getTopPairsForEachLength(
    //     promotionWithConfidence.frequentItemsForPromotion,
    //     2
    //   );

    // * bundle, and top 5
    promotionWithConfidence.frequentItemsForPromotion = getTopBundles(
      promotionWithConfidence.frequentItemsForPromotion,
      5
    );

    console.log(promotionWithConfidence.frequentItemsForPromotion);

    res.json({
      success: true,
      message: "Generating Promotions Success!",
      promotions: promotionWithConfidence,
    });

    console.log(promotionWithConfidence);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const runAlgorithm = async (transactions) => {
  // console.log("transactions", transactions);

  // * Dynamic minimum support and confidence thresholds
  const totalTransactions = transactions.length;
  const minSupportThreshold = 0.1; // * Example: 10% of transactions
  const minConfidenceThreshold = 0.5; // * Example: 50% confidence

  const minSupport = minSupportThreshold * totalTransactions;
  const minConfidence = minConfidenceThreshold; // * Confidence is typically a percentage

  console.log(`Minimum Support: ${minSupport}`);
  console.log(`Minimum Confidence: ${minConfidence}`);

  // * execute Apriori with a minimum support of 40%.
  // * adjust support threshold when transaction gets bigger
  // var apriori = new Apriori(0.4); // * commented out for dynamic threshold
  var apriori = new Apriori(minSupport / totalTransactions);
  console.log(`Executing Apriori...`);

  let frequentItemsets = [];
  let highConfidenceRules = [];

  // * returns itemsets 'as soon as possible' through events.
  apriori.on("data", function (itemset) {
    // * generate promotion for item sets
    frequentItemsets.push(itemset);
    var support = itemset.support;
    var items = itemset.items;
    // console.log(
    //   `Itemset { ${items.join(
    //     ","
    //   )} } is frequent and have a support of ${support}`
    // );
  });

  // * execute Apriori on a given set of transactions.
  let result = await apriori.exec(transactions).then(function (result) {
    // * returns both the collection of frequent itemsets and execution time in millisecond.
    // var frequentItemsets = result.itemsets;
    var executionTime = result.executionTime;
    console.log(
      `Finished executing Apriori. ${frequentItemsets.length} frequent itemsets were found in ${executionTime}ms.`
    );
    // console.log("result:", result);

    // * generate association rules from frequent itemsets
    const associationRules = generateAssociationRules(
      frequentItemsets,
      minConfidence
    );
    // console.log("Association Rules:", associationRules);

    // * log rules with confidence
    associationRules.forEach((rule) => {
      // console.log(
      //   `Rule { ${rule.antecedent.join(",")} } -> { ${rule.consequent.join(
      //     ","
      //   )} } with confidence ${rule.confidence}`
      // );
    });

    // * Store high-confidence rules
    highConfidenceRules = associationRules.filter(
      (rule) => rule.confidence >= minConfidence
    );

    // * Log rules with confidence
    highConfidenceRules.forEach((rule) => {
      // console.log(
      //   `Rule { ${rule.antecedent.join(",")} } -> { ${rule.consequent.join(
      //     ","
      //   )} } with confidence ${rule.confidence}`
      // );
    });

    // * Generate promotions
    let promotionWithConfidence = generatePromotions(
      frequentItemsets,
      highConfidenceRules
    );

    return promotionWithConfidence;
  });

  return result;
};

// * END OF EX FROM GH

// * FROM GPT

// * Function to generate association rules from frequent itemsets
const generateAssociationRules = (frequentItemsets, minConfidence) => {
  let rules = [];
  frequentItemsets.forEach((itemset) => {
    if (itemset.items.length > 1) {
      const subsets = getSubsets(itemset.items);
      subsets.forEach((subset) => {
        if (subset.length > 0 && subset.length < itemset.items.length) {
          const antecedent = subset;
          const consequent = itemset.items.filter(
            (item) => !subset.includes(item)
          );
          const confidence =
            itemset.support / findSupport(frequentItemsets, antecedent);
          if (confidence >= minConfidence) {
            rules.push({ antecedent, consequent, confidence });
          }
        }
      });
    }
  });
  return rules;
};

// * Function to get all subsets of a set
const getSubsets = (array) => {
  const subsets = [];
  const n = array.length;
  for (let i = 1; i < 1 << n; i++) {
    const subset = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        subset.push(array[j]);
      }
    }
    subsets.push(subset);
  }
  return subsets;
};

// * Function to find support for a given itemset
const findSupport = (frequentItemsets, itemset) => {
  const result = frequentItemsets.find(
    (set) =>
      set.items.length === itemset.length &&
      set.items.every((item) => itemset.includes(item))
  );
  return result ? result.support : 0;
};

// * Function to generate promotions
const generatePromotions = (frequentItemsets, highConfidenceRules) => {
  // * extracting frequent item sets for promotions regardless of itemsets length
  // const frequentItemsForPromotion = frequentItemsets.map((itemset) => ({
  //   items: itemset.items,
  //   support: itemset.support,
  // }));

  // * extracting frequent item sets for promotions (excluding single items)
  const frequentItemsForPromotion = frequentItemsets
    .filter((itemset) => itemset.items.length > 1) // Filter out itemsets with only one item
    .map((itemset) => ({
      items: itemset.items,
      support: itemset.support,
    }));

  // * Extracting high confidence rules for promotions
  const highConfidencePromotions = highConfidenceRules.map((rule) => ({
    antecedent: rule.antecedent,
    consequent: rule.consequent,
    confidence: rule.confidence,
  }));

  // console.log("Frequent Items for Promotion:", frequentItemsForPromotion);
  // console.log("High Confidence Promotions:", highConfidencePromotions);

  // * Additional logic to generate promotion details can be added here
  return {
    frequentItemsForPromotion,
    highConfidencePromotions,
  };
};

// * END OF GPT EX

// * Function to get top pairs for each length of item set
const getTopPairsForEachLength = (data, n) => {
  // Group items by length of item set (number of items)
  const groupedByLength = {};

  data.forEach((item) => {
    const key = item.items.length.toString();
    if (!groupedByLength[key]) {
      groupedByLength[key] = [];
    }
    groupedByLength[key].push(item);
  });

  // Extract top n pairs for each length group
  const topPairs = [];
  Object.keys(groupedByLength).forEach((key) => {
    const items = groupedByLength[key];

    // Sort items by support in descending order
    items.sort((a, b) => b.support - a.support);

    // Take top n pairs
    const topNItems = items.slice(0, n);

    // Push top pairs to result
    topPairs.push(...topNItems);
  });

  return topPairs;
};

// * Function to get top bundles based on support count
function getTopBundles(data, topCount) {
  // Sort data by support count in descending order
  const sortedData = data.sort((a, b) => b.support - a.support);

  // Take the top 'topCount' item sets
  const topBundles = sortedData.slice(0, topCount);

  return topBundles;
}

export {
  requestOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getUserOrder,
  runApriori,
};
