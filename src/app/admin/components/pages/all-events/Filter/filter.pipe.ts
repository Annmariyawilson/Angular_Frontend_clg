import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allEvents: any[], filter: String, eventStatus: String): any[] {
    const sortData: any = []
    if (!allEvents || filter == "" || eventStatus == "") {
      return allEvents
    }
    allEvents.forEach((eventFilter: any) => {
      if (eventFilter.eventStatus.toLowerCase().includes(filter.toLowerCase())) {
        sortData.push(eventFilter)
      }
      console.log("filter ",sortData)
    })
    return sortData
    
  }

}


