import { badRequest, notFound } from "../utils/apiError.js";
import { createId, getCollection, getTimestamp } from "../utils/mockStore.js";

function matchesQuery(item, query) {
  return Object.entries(query).every(([key, value]) => {
    if (value === undefined || value === "") {
      return true;
    }

    if (key === "q") {
      const keyword = value.toLowerCase();
      return [item.name, item.title, item.description, item.address]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(keyword));
    }

    return String(item[key]) === String(value);
  });
}

export function createCrudService(collectionName, idPrefix) {
  const collection = getCollection(collectionName);

  return {
    list(query = {}) {
      return collection.filter((item) => matchesQuery(item, query));
    },

    getById(id) {
      const item = collection.find((entry) => entry.id === id);
      if (!item) {
        throw notFound(`${collectionName} item not found`);
      }
      return item;
    },

    create(payload) {
      if (!payload || typeof payload !== "object") {
        throw badRequest("Request body must be an object");
      }

      const timestamp = getTimestamp();
      const item = {
        id: payload.id || createId(idPrefix),
        ...payload,
        createdAt: payload.createdAt || timestamp,
        updatedAt: timestamp,
      };

      collection.push(item);
      return item;
    },

    update(id, payload) {
      if (!payload || typeof payload !== "object") {
        throw badRequest("Request body must be an object");
      }

      const index = collection.findIndex((entry) => entry.id === id);
      if (index === -1) {
        throw notFound(`${collectionName} item not found`);
      }

      collection[index] = {
        ...collection[index],
        ...payload,
        id: collection[index].id,
        updatedAt: getTimestamp(),
      };

      return collection[index];
    },

    remove(id) {
      const index = collection.findIndex((entry) => entry.id === id);
      if (index === -1) {
        throw notFound(`${collectionName} item not found`);
      }

      const [removed] = collection.splice(index, 1);
      return removed;
    },
  };
}
