package com.bot.service.controllers;


import javax.annotation.security.RolesAllowed;

import com.bot.service.services.UserGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin(maxAge = 3600)
@Controller
public class WebController

{
@Autowired
    UserGenerator userGenerator;

    @RolesAllowed("DEVELOPER")
    @RequestMapping("/developer")
    public ModelAndView getDeveloperPage()
    {
        String  username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
             username = ((UserDetails)principal).getUsername();
        } else {
             username = principal.toString();
        }

        ModelAndView model = new ModelAndView("developer");
        model.addObject("username", username);
        model.addObject("reviewers", userGenerator.getUsernamesByRole("REVIEWER"));
        return model;
    }

    @RolesAllowed("REVIEWER")
    @RequestMapping("/reviewer")
    public ModelAndView getReviewerPage()
    {

        String  username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }

        ModelAndView model = new ModelAndView("reviewer");
        model.addObject("username", username);
        return model;
    }
}