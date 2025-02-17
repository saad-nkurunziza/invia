"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { addTask } from "@/server/task";
import { useState } from "react";
import { useRouter } from "next/navigation";

const priorities = ["low", "medium", "high"];
const categories = ["work", "personal", "urgent"];

const TaskScheduler = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("work");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const router = useRouter();
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", newTask);
    formData.append("date", selectedDate.toISOString());
    formData.append("category", selectedCategory);
    formData.append("priority", selectedPriority);

    await addTask(formData);
    setNewTask("");
    router.refresh(); // Refresh the page to reflect the new task
  };

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  return (
    <div>
      {daysInMonth.map((day, index) => (
        <Dialog key={day.toISOString()}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className={`h-24 border-t border-b ${
                index % 7 !== 0 ? "border-l" : ""
              } ${index % 7 !== 6 ? "border-r" : ""} ${
                day.getMonth() !== currentMonth.getMonth() ? "opacity-50" : ""
              }`}
            >
              <div className="w-full h-full flex flex-col items-start">
                <span className="text-sm">{format(day, "d")}</span>
                {/* Future: Display tasks for the day */}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tasks for {format(day, "MMMM d, yyyy")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <Label htmlFor="newTask">New Task</Label>
                <Input
                  id="newTask"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={setSelectedCategory}
                  defaultValue={selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={setSelectedPriority}
                  defaultValue={selectedPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" onClick={() => setSelectedDate(day)}>
                Add Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default TaskScheduler;
