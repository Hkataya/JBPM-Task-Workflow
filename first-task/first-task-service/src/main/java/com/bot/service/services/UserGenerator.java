package com.bot.service.services;

import com.bot.service.pojos.User;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Scope("singleton")
public class UserGenerator {

    private ArrayList<User> users;

    public UserGenerator(){
        users = new ArrayList<>();
        users.add(new User("dev1", "dev1", "DEVELOPER"));
        users.add( new User("rev1", "rev1", "REVIEWER"));
        users.add( new User("rev2", "rev2", "REVIEWER"));
    }

    public ArrayList<User> getUsers(){
        return users;
    }

    public ArrayList<String> getUsernamesByRole(String role){
        ArrayList<String> filteredUsers = new ArrayList<>();
        for(User user : users)
            if(role.equals(user.getRole()))
                filteredUsers.add(user.getUsername());
        return filteredUsers;
    }

}
