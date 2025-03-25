/**
 * Set years for billing display based on a set of pre-defined rules.  If the month is after August, then it will show
 * the current year.  Otherwise it will show the prior year.  This handles rollovers from year to year when we want
 * to see the prior year's data.
 *
 * This uses the React style of calling a function with a function to call as a parameter, rather than returning values.
 *
 * @param setInitialYear function to set the initial year on front end.
 * @param setYearsList function to set the years list on the front end.
 */
export default function getYearsForBillingDisplay(setInitialYear: Function, setYearsList: Function) {
    const displayYears = [];
    const now = new Date();
    const nowYear = now.getFullYear();
    // if it's after August, show next year
    if (now.getMonth() > 7) {
        setInitialYear(nowYear + 1);
    } else {
        // otherwise, show this year
        setInitialYear(nowYear);
    }
    for (let pushYear = 2022; pushYear <= nowYear + 1; pushYear++) {
        displayYears.push(pushYear);
    }
    setYearsList(displayYears.sort().reverse());
}
