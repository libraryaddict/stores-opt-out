import { fileToBuffer, getProperty, print, setProperty } from "kolmafia";

function getIgnores(): string[] {
  const data = fileToBuffer("stores-opt-out.txt").split(/[\r\n]+/);
  const userIds: string[] = [];

  for (const line of data) {
    // Ignore empty lines or lines starting with a pound symbol
    if (line.startsWith("#") || line.trim().length == 0) {
      continue;
    }

    const match = line.match(/^ID: (\d+) *$/);

    if (match == null) {
      print(
        `Invalid line found while loading list for stores-opt-out: ${line}`,
        "gray"
      );
      continue;
    }

    userIds.push(match[1]);
  }

  return userIds;
}

// A list of stores we've added to forbiddenStores
function existingOptOuts(): string[] {
  return getProperty("optedOutStores")
    .split(",")
    .filter((s) => s.length > 0);
}

// Set the stores we've added to the forbiddenStores
function updateExistingOptOuts(stores: string[]) {
  setProperty("optedOutStores", stores.join(","));
}

// Get the forbiddenStores without the stores we've added
function getCleanForbiddenStores(): string[] {
  const stores = getProperty("forbiddenStores")
    .split(",")
    .filter((s) => s.length > 0);
  const existing = existingOptOuts();

  return stores.filter((s) => !existing.includes(s));
}

function start() {
  const cleanForbidden = getCleanForbiddenStores();
  const existing = existingOptOuts();

  const newIgnores = getIgnores().filter(
    (s) => !cleanForbidden.includes(s) && !existing.includes(s)
  );
  newIgnores.forEach((s) => existing.push(s));

  updateExistingOptOuts(existing);

  cleanForbidden.push(...existing);

  const ignoresString = cleanForbidden.join(",");

  setProperty("forbiddenStores", ignoresString);
}

function end() {
  setProperty("forbiddenStores", getCleanForbiddenStores().join(","));

  updateExistingOptOuts([]);
}

export function optOutStores(runnable: () => void) {
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
