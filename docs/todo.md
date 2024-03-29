# ToDo

This file contains list of things and thoughts about features I'd like to put in Timesheet App.

## Issues view

I decided to make Issues view first. This view allow to oversee the summary of Issues. As it has a lot of different things to do, I decided to move specification into separate file. 

See it [here](./issues).

## Weekly view

At the moment the application creates daily sheet only in case if you open the app in that day.

That's why I want to make it possible to open the Weekly View and make it possible to activate the missed Day in that view.

Weekly View might be opened in case when you click on the week title (that gray header containing the Calendar icon and dates like _Dec 21, 2023 — Dec 23, 2023_)

## Analytics

I'd like to put some Analytics here, so you'll be able to get all or some project / issue overview across any period of time.

### Tags

I think there should be possibility to mark activities with tags. Therefore, there will be possibility to make and process metadata.

## Projects

### Update (2024-03-07)

Probably, the better name for this section is **Categories**.

### Initial version

BTW, it might have the Projects section, so if you save activities in form of `ABC-123: Hello World`, you should be able to define the group or _project_ for them. 

Like define a rule for all activities starting with `ABC-XXX:` - _Those activities are belongs to some project with name ABC._

And you should be able to set the Project description and get here some overview / analytics too. 

## Sync

This project from the very beginning is thought not to store the User's data with cloud services.

I added CSV file export and import in order to move data across the different devices (and make the backups too) but I still have a feeling that it is not enough. 

So I'm thinking about some backend API that might store the user's data **with user's permission**.

Like in form of one-time shareable links and QR Codes.

## Organizations

I have some thoughts about adapting time tracking Timesheet App for the business needs and sell the time tracking service. Going to have the big vision for this. 
