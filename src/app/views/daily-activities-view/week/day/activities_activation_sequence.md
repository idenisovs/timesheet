# Activities Activation Sequence

1. Create ActivityForm group
   - It is empty array at this point
2. Running `ngOnInit`
   - Call `loadActivities`
     - Read activities with `this.activitiesService.loadDailyActivities(this.day);`
       - In here we're just taking the activities from repository
     - Update activities form
       - If there is no activities, then just skip the activities form update!
     - Recalculate duration
   - If there is some activities, activate the first in list
   - Subscribe to the value changes subscription
