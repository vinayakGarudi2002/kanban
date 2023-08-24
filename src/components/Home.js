import React, { useState, useEffect } from 'react';
import Card from './card/Card'; 
import "./Home.css"

const Home = () => {
  const [ticketData, setTicketData] = useState(null);
  const [groupBy, setGroupBy] = useState('status'); // Default grouping
  const [sortBy, setSortBy] = useState('title'); // Default sorting

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => setTicketData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
if(!ticketData){
    return("loading..")
}
  const groupOptions = ['status', 'user', 'priority'];
  const sortOptions = ['title', 'priority'];

  const statusOptions = ['Backlog', 'Todo', 'In progress', 'Done', 'Canceled'];

  const priorityOptions = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No Priority',
    
  };

  const handleGroupByChange = event => {
    setGroupBy(event.target.value);
  };

  const handleSortByChange = event => {
    setSortBy(event.target.value);
  };

  const sortComparator = (a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'priority') {
      return b.priority - a.priority;
    }
    return 0;
  };

  let groupedAndSortedTickets = {};

  if (groupBy === 'user') {
    // Group by user
    groupedAndSortedTickets={}

    ticketData.users.forEach(user => {
      const userTickets = ticketData.tickets
        .filter(ticket => ticket.userId === user.id)
        .sort(sortComparator);
      groupedAndSortedTickets[user.name]=(userTickets);
    });
  } else {
    // Group by other options
    ticketData.tickets.forEach(ticket => {
      const groupValue = groupBy === 'status' ? ticket.status : ticket.priority;
      if (!groupedAndSortedTickets[groupValue]) {
        groupedAndSortedTickets[groupValue] = [];
      }
      groupedAndSortedTickets[groupValue].push(ticket);
    });

    // Sort each group's tickets
    for (const groupValue in groupedAndSortedTickets) {
      groupedAndSortedTickets[groupValue].sort(sortComparator);
    }
  }

  const getColumnCount = groupValue => {
    return groupedAndSortedTickets[groupValue] ? groupedAndSortedTickets[groupValue].length : 0;
  };

  return (
    <div className="home">
      <div className="dropdowns">
     

        <label htmlFor="display">Grouping:</label>
        <select id="display" value={groupBy} onChange={handleGroupByChange}>
          {groupOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
  
        <label htmlFor="sort-by">Ordering:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortByChange}>
          {sortOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        

      </div>

     
<div className="dashboard">
<div className="columns">
  {groupBy === 'status' && statusOptions.map((status, index) => (
    <div key={index} className="column">
      <div className="cardheader">  <h2  className="header">{status}  {getColumnCount(status)}</h2>
       </div>
    
      {groupedAndSortedTickets[status]?.map(ticket => (
        <Card
          key={ticket.id}
          id={ticket.id}
          title={ticket.title}
          tag={ticket.tag[0]}
          userId={ticket.userId}
          users={ticketData.users}
        />
      ))}
    </div>
  ))}

  {groupBy === 'priority' && Object.keys(priorityOptions).map(priority => (
    <div key={priority} className="column">
      <h2 className="header">{priorityOptions[priority]} {getColumnCount(priority)}</h2>
      {groupedAndSortedTickets[priority]?.map(ticket => (
        <Card
          key={ticket.id}
          id={ticket.id}
          title={ticket.title}
          tag={ticket.tag[0]}
          userId={ticket.userId}
          users={ticketData.users}
        />
      ))}
    </div>
  ))}

  {groupBy === 'user' && Object.keys(groupedAndSortedTickets).map(user_name => (
    <div key={user_name} className="column">
      <h2 className="header">{user_name} {getColumnCount(user_name)}</h2>
      {groupedAndSortedTickets[user_name]?.map(ticket => (
        <Card
          key={ticket.id}
          id={ticket.id}
          title={ticket.title}
          tag={ticket.tag[0]}
          userId={ticket.userId}
          users={ticketData.users}
        />
      ))}
    </div>
  ))}

</div></div>
</div>
);
};

export default Home;