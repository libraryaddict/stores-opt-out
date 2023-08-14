# How do I install this?

There are two different methods, depending on your usecase.
If you want this as a standalone script, you will use

`git checkout loathers/KolBoycotto release`

This will install both the data file, and the script. The script itself can be run as a standalone with the arguments `start` and `stop`

Otherwise to install just the data file but not the standalone script, you will use

`git checkout loathers/KolBoycotto release-data`

# What is this?

This is a script/library that aims to provide a list of user IDs that scripts should implement to avoid purchases from these stores.
The goal being that those stores do not want scripts to be buying them from, not now, not ever.

If a player ID is in the list, that player acknowledges that their sales will plummet, that changing their mind is not feasible and that this is an opt-in for the scripts. No one is making the scripts avoid your stores. This is opt-in for both script and the store but unless the script provides one, no opt-out for the end user.

This is by and large aimed towards philanthropist stores, stores that are operating at a loss. An example of this is a store that stocks items worth 5k meat each, at 100 meat with a limit of 1. Garbo would normally buy from their store and convert it into meat, making the player unhappy as this has zero user interaction with their store. It was meant to be towards the poorer players.

Yes, this is a decision they made. But scripting is impersonal and the vast majority of scripts has some sort of aim towards profit making. If you're making profit, you should be avoiding the stores that are being kind and generous.
Obviously, this doesn't apply to all stores, some stores operate at a loss but they just want to provide a service to everyone, human and bot alike; Essential Tofu for example.

# How do I add my player #ID?

To add your player ID, you will need to either contact a member of the LASS team in ASS, either ingame or in discord.
You will need to provide your user ID, your name, and the reason you want it added. This will be public information.

Why do we want the reason? So if we look at the list, we can point back at it and say 'They only want to host ARs in games (na) and don't want people buying tickets automatically'.
We don't want people going "Oh, why does HalfDayLooper (#12345) have his ID in there? He said he loves using scripts". Instead you'd say "Huh, so he stocks ascension stuff but only wants stunt runs to be buying from him"

# How do I add this to my script?

You will need a `dependencies.txt` in the root file of your script installation files. Add `github loathers/KolBoycotto release-data` to it.

Then you will run either `yarn install boycotto` if you are using yarn, or `npm install boycotto` if you're using npm.

Given how mall prices work in mafia, you'll want to have everything looked up using this script. Else you may think one item is in mall for 400 meat, but the item was in a store we want to ignore and the cheapest is actually 9000 meat.

So you'll want this script in one of the parent callers, such as the main part of the script where everything is run.

Example.

```
// Our calling function
export function main() {
    // We invoke `runBoycotto` with a parameter which is a runnable
    runBoycotto(() => {
            // All the stores have been added to `forbiddenStores`, we're safe

            // The price is reported as 5000 meat. If we checked this outside of the runnable, it would be 100 meat
            const price = mallPrice(Item.get("Milk of Magnesium));
            print(`The price of magnesium is ${price}`);
        }
    );
    // The function has exited and will restore the `forbiddenStores` back to what it was previously
}
```

# How does this update?

The user will only be installing the data file, this is updated when you run `git update`.
Even if the parent script hasn't been updated for years, the list of IDs should still be updated.

The same applies if you're using the standalone boycotto script. It will still update the data file. They are bundled separately deliberately.