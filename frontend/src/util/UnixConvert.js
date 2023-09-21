export function UnixToGuess(t) { //t = unix timestamp from data
    const Diff = Math.floor(Date.now() - t) //Get difference
    const Seconds = Math.floor(Diff/1000) //Convert to seconds
    const Minutes = Math.floor(Seconds/60) //to minutes
    const Hours = Math.floor(Minutes/60) //to Hours
    const Days = Math.floor(Hours/24) //to Days
    const Weeks = Math.floor(Days/7) //to Weeks
    const Months = Math.floor(Weeks*0.229984) //to Months (estimate)
    const Years = Math.floor(Months/12) //to years

    let Guess = null
    //console.log('It has been '+Seconds+' seconds, '+Minutes+' minutes, '+Hours+' hours & '+Days+' days')
    if (Years > 0) {
        const addition = Years > 1 ? 's' : '' //I like tiny details :^)
        Guess = Years+' Year'+addition+' Ago'
    } else if (Months > 0) {
        const addition = Months > 1 ? 's' : ''
        Guess = Months+' Month'+addition+' Ago'
    } else if (Weeks > 0) {
        const addition = Weeks > 1 ? 's' : '' 
        Guess = Weeks+' Week'+addition+' Ago'
    } else if (Days > 0) {
        const addition = Days > 1 ? 's' : ''
        Guess = Days+' Day'+addition+' Ago'
    } else if (Hours > 0) {
        const addition = Hours > 1 ? 's' : ''
        Guess = Hours+' Hour'+addition+' Ago'
    } else if (Minutes > 0) {
        const addition = Minutes > 1 ? 's' : ''
        Guess = Minutes+' Minute'+addition+' Ago'
    } else if (Seconds > 0) {
        const addition = Seconds > 1 ? 's' : ''
        Guess = Seconds+' Second'+addition+' Ago'
    }
    return Guess
}