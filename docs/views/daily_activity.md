# Daily Activity View

## Structure

```mermaid
flowchart TD
  DAP[Daily Activities Page]
  DAW[Daily Activities Week]
  DAWH[Daily Activities Week Header]
  DAWD[Daily Activities Week Day]
  DAWDH[Daily Activities Week Day Header]
  DAWDM[Daily Activities Week Day Missing]
  
  DAWDMW[Mobile View]
  DAWDDW[Desktop View]
  
  
  DAI[Daily Activity Item]
  DAIM[Daily Activity Item Mobile]
  
  IM{Is Mobile}
  
  DAP --> DAW
  DAW --> DAWH
  DAW --> DAWD
  DAW --> DAWDM
  
  DAWD --> IM
  
  IM --"yes"--> DAWDMW
  IM --"no"--> DAWDDW
  
  DAWDMW --> DAWDH
  DAWDMW --> DAIM
  
  DAWDDW --> DAWDH
  DAWDDW --> DAI
  
```

## Daily Activity Page

- Mounted through the application Router;
- Running the `infiniteScroll` directive;
- Displays the `daily-activities-week` component for the `Week` objects;

## Daily Activities Week

- Displays the Week Header component;
- If there is some days marked **missing**, then show the `daily-activities-week-day-missing` component;
- Otherwise, show the `daily-activities-week-day` component;
  - On **changes** in `daily-activities-week-day` recalculate the summary of the **week**;

## Daily Activities Week Day

- Switches between **Mobile** and **Desktop** views;
- **Save**, **Add**, **Remove**, **Reset** actions are **occurring in this component**;

### Mobile View

- Displays the `daily-activity-item-mobile`;
- Shows the `daily-activity-item` component, adapted for the mobile views;

### Desktop View

- Displays the `daily-activities-week-day-header`;
- For **Daily Activities**, shows the `daily-activity-item` component;
- And `daily-activities-week-day-footer` component;
