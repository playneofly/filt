package com.filternet.app.model

import androidx.annotation.ColorRes
import com.filternet.app.R

/**
 * مدل داده سرور VPN
 */
data class Server(
    val id: String,
    val country: String,
    val city: String,
    val code: String,         // کد ۲ حرفی کشور: DE, NL, ...
    val ping: Int,            // میلی‌ثانیه
    val load: Int,            // درصد بار سرور ۰..۱۰۰
    val isPremium: Boolean = false,
    val isBest: Boolean = false,
    @ColorRes val gradientStartRes: Int = R.color.server_de_start,
    @ColorRes val gradientEndRes: Int = R.color.server_de_end,
)

/**
 * کیفیت پینگ
 */
enum class PingQuality {
    GOOD,   // < 60ms
    MID,    // < 100ms
    BAD;    // >= 100ms

    companion object {
        fun from(ping: Int) = when {
            ping < 60  -> GOOD
            ping < 100 -> MID
            else       -> BAD
        }
    }
}

/**
 * لیست سرورهای پیش‌فرض
 */
object ServerRepository {

    val all: List<Server> = listOf(
        Server(
            id = "de-1", country = "آلمان", city = "فرانکفورت",
            code = "DE", ping = 43, load = 32, isBest = true,
            gradientStartRes = R.color.server_de_start,
            gradientEndRes   = R.color.server_de_end,
        ),
        Server(
            id = "nl-1", country = "هلند", city = "آمستردام",
            code = "NL", ping = 51, load = 44,
            gradientStartRes = R.color.server_nl_start,
            gradientEndRes   = R.color.server_nl_end,
        ),
        Server(
            id = "fr-1", country = "فرانسه", city = "پاریس",
            code = "FR", ping = 58, load = 27,
            gradientStartRes = R.color.server_fr_start,
            gradientEndRes   = R.color.server_fr_end,
        ),
        Server(
            id = "uk-1", country = "انگلیس", city = "لندن",
            code = "GB", ping = 66, load = 61,
            gradientStartRes = R.color.server_uk_start,
            gradientEndRes   = R.color.server_uk_end,
        ),
        Server(
            id = "sg-1", country = "سنگاپور", city = "سنگاپور",
            code = "SG", ping = 89, load = 38, isPremium = true,
            gradientStartRes = R.color.server_sg_start,
            gradientEndRes   = R.color.server_sg_end,
        ),
        Server(
            id = "jp-1", country = "ژاپن", city = "توکیو",
            code = "JP", ping = 104, load = 22, isPremium = true,
            gradientStartRes = R.color.server_de_start,
            gradientEndRes   = R.color.server_nl_end,
        ),
        Server(
            id = "tr-1", country = "ترکیه", city = "استانبول",
            code = "TR", ping = 72, load = 54,
            gradientStartRes = R.color.fn_amber,
            gradientEndRes   = R.color.server_nl_end,
        ),
        Server(
            id = "us-1", country = "آمریکا", city = "نیویورک",
            code = "US", ping = 128, load = 47, isPremium = true,
            gradientStartRes = R.color.fn_accent_2,
            gradientEndRes   = R.color.server_nl_end,
        ),
        Server(
            id = "ae-1", country = "امارات", city = "دبی",
            code = "AE", ping = 61, load = 35,
            gradientStartRes = R.color.server_sg_start,
            gradientEndRes   = R.color.server_fr_end,
        ),
        Server(
            id = "fi-1", country = "فنلاند", city = "هلسینکی",
            code = "FI", ping = 79, load = 18,
            gradientStartRes = R.color.server_fr_start,
            gradientEndRes   = R.color.fn_accent,
        ),
    )

    /** بهترین سرور بر اساس پینگ */
    fun getBest(): Server = all.minByOrNull { it.ping }!!
}
