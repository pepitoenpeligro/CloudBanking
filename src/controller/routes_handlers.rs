
use std::collections::HashMap;
use crate::CloudBankingController;
use crate::user::model::user::User;

use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{Arc,Mutex, RwLock};

use log::{debug, error, log_enabled, info, Level};
use actix_web::*;

use super::middleware::CheckIdUserService;


pub async fn not_responding(req: HttpRequest) -> Result<HttpResponse, Error> {
    log::info!("Received request from uri: {}", req.uri());
    return Ok(HttpResponse::BadRequest().json("You are not allowed to be here"));
}


pub async fn healthcheck(req: HttpRequest) -> Result<HttpResponse, Error> {
    log::info!("Received request from uri: {}", req.uri());
    return Ok(HttpResponse::Ok().json("I am alive"));
}


pub async fn get_users(cbc: web::Data<Arc<RwLock<CloudBankingController>>>, req: HttpRequest) -> Result<HttpResponse, Error> {
    log::info!("Received request from uri: {}", req.uri());

    let my_controller = cbc.read();
    let users_lock= my_controller.unwrap();
    let users_arc = users_lock.get_users();
    let users = users_arc.read().unwrap();

    if users.len() >= 0 {
        log::info!("Returning users list {:?}", users.to_owned());
        return Ok(HttpResponse::Ok().json(users.to_owned()));
    }else{
        log::info!("Error getting user list {:?}", users.to_owned());
        return Ok(HttpResponse::NoContent().json(users.to_owned()));
    }

    
}

pub async fn get_user_by_id(_: CheckIdUserService, req: HttpRequest) -> Result<HttpResponse, Error> {
    log::info!("Received request from uri: {}", req.uri());
    return Ok(HttpResponse::Ok().json("Implementing"));
}

pub async fn add_user(cbc: web::Data<Arc<RwLock<CloudBankingController>>> , request: web::Json<User>, req: HttpRequest) -> Result<HttpResponse, Error> {

    log::info!("Received request from uri: {}", req.uri());
    let user :User = request.to_owned();
    cbc.write().unwrap().create_new_user(user);
    return Ok(HttpResponse::Ok().json("user saved"));
}

    