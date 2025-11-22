# ToDo

This file contains a list of _technical_ tasks and considerations.

For a more abstract and high-level perspective, please refer to the [Roadmap](./roadmap.md) file.  

## Mobile Mode

I tried previous mobile mode IRL and didn't like it very-very much. So, I decided to rework it.

- Handle Ticket / Description parts in field `name` of Activity:
  - Handle Ticket part of field `name`. There might be no Ticket at all, so it should be properly handled.
- Allow to save activities;
- Hide Description section, if there is nothing to show;

## Time Rounding

I'd like to have an option, that allowed to set the rounding for times.

Like, if I set the current time with Time Button, and it is `14:34`, then time appearing in input will be rounded to `14:35`. Or, if there is `12:21`, then it will be rounded to `12:20`.

## Side-menu for Responsive Mode

I don't like how the NavBar is looking in Mobile view. Thankfully, there is [Offcanvas](https://ng-bootstrap.github.io/#/components/offcanvas/examples) option, so I use it as a base for application's menu, which might be opened by pressing the [Hamburger Button](https://en.wikipedia.org/wiki/Hamburger_button) or by make a _left-to-right_ swipe.  
