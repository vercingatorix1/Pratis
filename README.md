# Pratis
Project Visualizer and Resource Management- See [Excel file](https://docs.google.com/spreadsheets/d/11TEWfOZyNgMLzpzHCXnEhNgLXW_EjZNpQxxE0afSQQM/edit?usp=sharing) for backlog. 

The purpose of this tool is to take the fundementals of Data visualization and apply them to project data. 

Every project stakeholder wants to know "What is the team working on?". Despite the simple question, the answer is often complex and muddled, that is because this is often multiple questions wrapped up in one. 

Questions like: 
"In the next sprint, what is the team spending the most time on?"
"What is the team working on today?"
"What type of requests is the team receiving?"

The only way to answer "what is the team working on?" is to convey data, often a lot of data. An inconvenient amount of data to write or talk through in a meeting, that's why it needs to be visualized. 

When a user creates a team they must list the team members and assign an expected number of points from that team member or just let all team members have equal expectations. (Can be updated later)

These team members then have columns with a width relative to their expected output. Each user story assigned to a team member must be given an estimated points value which will be represented as the area of the user story. 

Now the user story needs to find a place on the board, based on it's backlog priority, the higher the priority, the sooner it must be completed, and the nearer the bottom it will show up. 

Now we have everything we need to visualize the story.

We place it:
horizontally, in the column of the assignee
Vertically, stacked on top of any higher priority user stories assigned to that team member. 

And how big is the story?
Width is the width of the assignee column.
Area is the number of points assigned to the user story
Height is calculated on the other two dimensions of the rectangle, Height= Area/height

Then we repeat that for every user story in the backlog with slight adjustments for dependencies between user stories. 


