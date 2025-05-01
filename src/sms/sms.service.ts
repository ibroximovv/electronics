import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from "axios";

@Injectable()
export class SmsService {
    private readonly baseUrl = 'https://notify.eskiz.uz/api'
    private readonly email = 'ilyosbekibrohimov22@gmail.com'
    private readonly password = 'Qn1RQYVUbG5NhJKS1d8aVWsWnZeu7pI5gpd7uyPn'
    private token: string | null = '';

    constructor(){}

    async authenticate() {
        try {
            const result = await axios.post(`${this.baseUrl}/auth/login`, {
                email: this.email,
                password: this.password
            })
            this.token = result?.data?.data?.token;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Eskiz login failed');
        }
    }

    async ensureAuthenticate() {
        if(!this.token) {
            this.authenticate()
        }
    }

    async sendSmsToPhone(phone: string, message: string) {
        await this.ensureAuthenticate()
        try {
            const res = await axios.post(`${this.baseUrl}/message/sms/send`, {
                mobile_phone: phone,
                message: 'Bu Eskiz dan test',
                from: '4546'
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })
            return res
        } catch (error) {
            this.token = null
            await this.ensureAuthenticate()
            await this.sendSmsToPhone(phone, message)
            console.log(error);
        }
    }
}