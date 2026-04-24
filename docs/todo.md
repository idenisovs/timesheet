# ToDo

This file contains a list of _technical_ tasks and considerations.

For a more abstract and high-level perspective, please refer to the [Roadmap](roadmap.md) file.

## Refactoring

1. Check the changes in the Mobile DAWD (_Daily Activities Week Day_) component. 

## Mobile Mode

- Update the mobile mode with recent changes for date string;
- Check if time-rounding settings are working here;
- Add modal confirmation for the Delete button;
- If an activity is new / empty, it should be sorted at the top of an activity list (**in Mobile**) or bottom (**in Desktop**).

## Side-menu for Responsive Mode

I don't like how the NavBar is looking in Mobile view. Thankfully, there is [Offcanvas](https://ng-bootstrap.github.io/#/components/offcanvas/examples) option, so I use it as a base for application's menu, which might be opened by pressing the [Hamburger Button](https://en.wikipedia.org/wiki/Hamburger_button) or by make a _left-to-right_ swipe.

## PWA

TBD
