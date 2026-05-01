# Daily Activity Item

## Activity Color Change

Change activity color when:

1. New activity case:
    - The color is `original`
    - If the typed name matches an existing activity - share its color
    - Remove the `original color` flag
2. Name without prefix, name matches an existing activity:
    - Share its color
    - Remove the `original color` flag
    - Reset the `color changed` flag
3. Name without prefix, no match found, original name was used by multiple activities:
    - Generate a fresh unique color
    - Remove the `original color` flag
4. Name without prefix, no match found, original name was used only once:
    - Keep the current color unchanged
5. Name with prefix, prefix has not changed:
    - Keep the current color unchanged
6. Name with prefix, prefix changed, matching activity found:
    - Share its color
    - Reset the `color changed` flag
7. Name with prefix, prefix changed, no match found:
    - Generate a fresh unique color
    - Remove the `original color` flag
8. Color generation guard:
    - A fresh color is generated only once per activity
    - Further name edits do not trigger another generation until the activity form item is replaced

## Color Bar Manual Testing

1. New activity, name matches an existing activity (no prefix):
    - Add a new activity row - the color bar shows the auto-assigned random color
    - Type a name that exactly matches a previously saved activity (e.g. `Daily standup`) - the color bar immediately changes to the color of that existing activity

2. New activity, name does not match anything (no prefix):
    - Add a new activity row
    - Type a name that does not exist in any saved activity - the color bar does not change

3. Name changes away, original name was used multiple times (no prefix):
    - Ensure at least two saved activities share the same name (e.g. two entries named `Daily standup`)
    - Add a new activity and type `Daily standup` - the color bar adopts the shared color
    - Change the name to something that does not exist (e.g. `My new task`) - the color bar changes to a freshly generated unique color

4. Name changes away, original name was used only once (no prefix):
    - Ensure exactly one saved activity has a specific name (e.g. `Solo task`)
    - Add a new activity and type `Solo task` - the color bar adopts its color
    - Change the name to something that does not exist - the color bar keeps its current color and does not generate a new one

5. Prefix typed, matches existing activities:
    - Ensure at least one saved activity has a prefix (e.g. `TST: some task`)
    - Add a new activity and type `TST: anything` - the color bar changes to the color associated with the `TST` prefix

6. Prefix stays the same, only the rest of the name changes:
    - Type `TST: first task` in the name field - the color bar gets the color for the `TST` prefix
    - Change the text to `TST: second task` keeping the prefix - the color bar does not change

7. Prefix changes to another known prefix:
    - Ensure saved activities exist for both `TST:` and `ABC:` prefixes, each with a different color
    - Type `TST: task` in the name field - the color bar shows the `TST` color
    - Change the prefix to `ABC: task` - the color bar switches to the `ABC` color

8. Prefix changes to an unknown prefix:
    - Type a name with a prefix that has no saved activities (e.g. `XYZ: task`) - the color bar changes to a freshly generated unique color

9. Color is generated only once per activity:
    - Trigger a fresh color generation (e.g. case 3 or case 8 above)
    - Continue editing the name to other values that also have no match - the color bar keeps the already generated color and does not change again

10. Existing activity keeps its color when renamed to an unknown unique name:
    - Open the day that has a saved activity with a known color
    - Edit the activity name to a value that does not exist anywhere else - the color bar keeps the original saved color
