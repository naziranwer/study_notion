export const formatDate = (dateString)=>{
    const options = {year:"numeric", month:"long", day:"numeric"}
    const date = new Date(dateString);
    const formatedDate = date.toLocaleDateString("en-US",options);

    const hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour > 12 ? "PM" : "AM";
    const formatedTime = `${hour % 12}:${minute.toString().padStart(2, "0")} ${period}`;


    return `${formatedDate} | ${formatedTime}`
}