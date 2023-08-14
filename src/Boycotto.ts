import { fileToBuffer, getProperty, print, setProperty } from "kolmafia";

// We use a higher number as the prefix so we're aware if forbiddenStores was sorted sequentially, aka modified
const startingPrefix = (999_999_999).toString();
const endingSuffix = (999_999_998).toString();

function getIgnores(): string[] {
  const data = fileToBuffer("boycotto_stores.txt").split(/[\r\n]+/);
  const userIds: string[] = [];

  for (const line of data) {
    // Ignore empty lines or lines starting with a pound symbol
    if (line.startsWith("#") || line.length == 0) {
      continue;
    }

    const match = line.match(/^ID: (\d+)$/);

    if (match == null) {
      print(
        `Invalid line found while loading list for Boycotto: ${line}`,
        "gray"
      );
      continue;
    }

    const userId = match[1];
    const reason = match[2];

    userIds.push(userId);
  }

  return userIds;
}

// A list of users that were in the forbidden stores list, before we modified it
function existingBoycotts(): string[] {
  return getProperty("existingBoycotts")
    .split(",")
    .filter((s) => s.length > 0);
}

// Update the list of stores that were forbidden by the player, not the script
function updateExistingBoycotts() {
  const stores = getProperty("forbiddenStores").split(",");

  // If the store list was modified by boycotto, ignore it
  if (stores.includes(startingPrefix) || stores.includes(endingSuffix)) {
    return;
  }

  // Sort the stores so that we're updating the preference as little as possible
  const sorted = stores.sort((s1, s2) => s1.localeCompare(s2));

  // Save the property
  setProperty("existingBoycotts", sorted.join(","));
}

function getCleanedProperty(state: "WARN" | "SILENT") {
  const stores = getProperty("forbiddenStores");

  // Get the starting index
  const startIndex = stores.indexOf(startingPrefix);

  // If index is not found, then the stores list isn't modified by boycotto
  if (startIndex < 0) {
    return stores;
  }

  // Get the index of the ending suffix, this should always be more than 0 of course
  const endIndex = stores.indexOf(endingSuffix);

  // Test if the suffix is before the prefix.
  // This should only be the case when the pref is corrupted or modified to an invalid state
  if (endIndex <= startIndex) {
    // This shouldn't happen on cleanup, but will be silent regardless
    if (state == "WARN") {
      // Enter recovery mode, we will delete all known ids
      print(
        "Corrupted forbiddenStores was detected by Boycotto, attempted to remove all known IDs",
        "gray"
      );
    }

    // A list of stores known to exist before we started
    const playerIgnored = existingBoycotts();
    const ignores = getIgnores();
    ignores.push(startingPrefix);
    ignores.push(endingSuffix);

    const storeList = stores
      .split(",")
      .filter((s) => playerIgnored.includes(s) || !ignores.includes(s));

    return storeList.join(",");
  }

  // At this point, the suffix should always be after the prefix
  // We only print a warning if this is unexpected
  if (state == "WARN") {
    print(
      "forbiddenStores was not cleaned properly by Boycotto, this was corrected",
      "gray"
    );
  }

  // Get all entries up until our modified entries
  const prefix = stores.substring(0, startIndex);
  // Get all entries after our modified entries
  const suffix = stores.substring(endIndex + endingSuffix.length);

  // The prefix unless someone messed with forbidden stores, will always start with a comma or empty line
  // The suffix will always start with a comma or be an empty line
  let newProperty = prefix + suffix;

  // We want to clean up duplicate commas, so there's several ways we could do it. Lets just go with the simplest.
  // Split the string by comma, remove any empty lines, join with a comma.
  newProperty = newProperty
    .split(",")
    .filter((s) => s.length > 0)
    .join(",");

  return newProperty;
}

function start() {
  // Update existing boycotts on start, not on end
  updateExistingBoycotts();

  const cleanForbidden = getCleanedProperty("WARN");
  // Don't add players that are already ignored
  const newIgnores = getIgnores().filter(
    (i) => !cleanForbidden.split(",").includes(i)
  );
  // Use a prefix and suffix so we can avoid handling new entries
  const ignores: string[] = [startingPrefix, ...newIgnores, endingSuffix];
  const ignoresString = ignores.join(",");

  setProperty(
    "forbiddenStores",
    (cleanForbidden.length > 0 ? cleanForbidden + "," : "") + ignoresString
  );
}

function end() {
  setProperty("forbiddenStores", getCleanedProperty("SILENT"));
}

export function run(runnable: () => void) {
  try {
    start();

    runnable();
  } finally {
    // Finally we reset it to the original prefix
    end();
  }
}

/**
 * @internal
 *
 * Using the @internal flag so that developers are not confused by the existance
 * of a `main` function when they use this as a library, which is for when this
 * script is executed as a standalone
 */
export function main(args: string = "") {
  if (args == "start") {
    start();
    return;
  } else if (args == "stop") {
    end();
    return;
  } else if (args) {
    print(`Unrecognized argument '${args}'`, "red");
  }

  print(
    `To invoke this from commandline, provide 'start' or 'stop' as a parameter`,
    "blue"
  );
}
