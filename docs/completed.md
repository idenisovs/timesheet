# Completed things

## Analytics View

For those times when you need detailed insights, whether preparing a report, overseeing completed work, or tracking down a specific activity from months ago, the Analytics View will be invaluable.

It will provide powerful tools for effectively managing and analyzing your data.

## Infinite Scroll

Add Infinite Scroll option to Daily Activity View. It should help to deal with huge lists of activities.

## Refactoring of data structure

Previous data structure persisted from Sheet documents, which had Activities field with list of Activity records. Each Sheet represented a day, and so a lot of calculations must be performed manually, especially having new Issues and Projects views. 

This led to the necessity of developing a new data structure, which was described in [this refactoring file](./refactoring/database_structure.md).

## Create missing days

I implemented it through _Show missing days_ feature. 

### Previous thoughts about it

At the moment the application creates daily sheet only in case if you open the app in that day.

That's why I want to make it possible to open the Weekly View and make it possible to activate the missed Day in that view.

Weekly View might be opened in case when you click on the week title (that gray header containing the Calendar icon and dates like _Dec 21, 2023 — Dec 23, 2023_)

## Projects (2024-03-13)

### Update (2024-03-07)

Probably, the better name for this section is **Categories**.

### Initial version

BTW, it might have the Projects section, so if you save activities in form of `ABC-123: Hello World`, you should be able to define the group or _project_ for them.

Like define a rule for all activities starting with `ABC-XXX:` - _Those activities are belongs to some project with name ABC._

And you should be able to set the Project description and get here some overview / analytics too.

## Issues view (2024-03-01)

I decided to make Issues view first. This view allow to oversee the summary of Issues. As it has a lot of different things to do, I decided to move specification into separate file.

See it [here](./issues).

## Add Copy button (06 Feb 2024)

Add the possibility to programmatically copy the Activity name via Copy button (`navigate.clipboard` or something like that).

## Turn on the HTTPS support (04 Feb 2024)

That is required to enable the next feature.

## Missing days (03 Feb 2024)

At the moment, if you miss a day, there is no way to write down some activities that day.

As solution, it is possible to go through the week and calculate missing days. If day is missing, then put some element in form of `card` or `alert` offering to create a day.
