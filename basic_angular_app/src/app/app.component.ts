import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'split-bill';
  expense: any = [];
  showAddGroup = false;
  showAddExpense = false;
  totalBalance = 0;
  showAddExpenseGroup = true;
  groupExpenseList: { Name: string, balance: number, members: any[] }[] = [];
  openAddGroup = () => {
    this.showAddGroup = true;
  }
  openAddExpense = () => {
    this.showAddExpense = true;
    this.showAddExpenseGroup = true;
  }

  getMemberList = (groupName: string) => {
    const foundGroup = this.groupExpenseList.find(element => element.Name === groupName);
    if (foundGroup) {
      return foundGroup.members;
    }
    this.showAddExpenseGroup = false;
    return [];
  }

  addNewExpenseUnequally = (newExpenseName: string, newExpenseAmount: string, newExpenseSplitFactor: string) => {
    const splitFactorList = newExpenseSplitFactor.split(",");
    const foundGroup = this.groupExpenseList.find(element => element.Name === newExpenseName);
    if (foundGroup) {
      let index = 0;
      foundGroup.members.forEach((value: any) => {
        const foundMember = this.expense.find((member: { Name: string, balance: number }) => member.Name === value.Name);
        if (foundMember) {
          foundMember.balance += (Number(newExpenseAmount) * Number(splitFactorList[index]));
          value.balance += (Number(newExpenseAmount) * Number(splitFactorList[index]));
          index++;
        }
      });
      foundGroup.balance += Number(newExpenseAmount);
      this.totalBalance += Number(newExpenseAmount);
    }
    this.showAddExpense = false;
  }

  addNewExpense = (name: string, amount: string | number) => {
    const foundGroup = this.groupExpenseList.find(element => element.Name === name);
    if (foundGroup) {
      const increment = Number(amount) / foundGroup.members.length;
      if (amount === 'Settle') {
        foundGroup.members.forEach((value: any) => {
          const foundMember = this.expense.find((member: { Name: string, balance: number }) => member.Name === value.Name);
          if (foundMember) {
            foundMember.balance -= value.balance;
            this.totalBalance -= value.balance;
            value.balance = 0;
          }
        });
        foundGroup.balance = 0;
      } else {
        foundGroup.members.forEach((value: any) => {
          const foundMember = this.expense.find((member: { Name: string, balance: number }) => member.Name === value.Name);
          if (foundMember) { foundMember.balance = foundMember.balance + increment; value.balance = value.balance + increment; }
        });
        foundGroup.balance += Number(amount);
        this.totalBalance += Number(amount);
      }
    }
    this.showAddExpense = false;
  };

  addGroup = (newGroupName: string, newGroupMembers: string, newGroupBalance: string) => {
    const memberList = newGroupMembers.split(",");
    let memberExpenseList: any[] = [];
    memberList.forEach((element: string) => {
      const found = this.expense.find((member: { Name: string, balance: number }) => member.Name === element);
      const memberInfo = {
        Name: element,
        balance: Number(newGroupBalance) / memberList.length
      };
      const memberInfoCopy = { ...memberInfo };
      if (found) {
        found.balance += Number(newGroupBalance) / memberList.length;
      } else {
        this.expense.push(memberInfo);
      }
      memberExpenseList.push(memberInfoCopy);
    });
    const newGroup = {
      Name: newGroupName,
      members: memberExpenseList,
      balance: Number(newGroupBalance)
    };
    this.groupExpenseList.push(newGroup);
    this.totalBalance += Number(newGroupBalance);
    this.showAddGroup = false;
  }
}

