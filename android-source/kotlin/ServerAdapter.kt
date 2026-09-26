package com.filternet.app

import android.content.Context
import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.filternet.app.model.PingQuality
import com.filternet.app.model.Server

/**
 * ServerAdapter
 * ──────────────
 * RecyclerView Adapter برای لیست سرورها در ServersFragment.
 * از DiffUtil استفاده می‌کند تا فقط آیتم‌های تغییریافته آپدیت شوند.
 */
class ServerAdapter(
    private val onSelect: (Server) -> Unit
) : ListAdapter<Server, ServerAdapter.ServerVH>(ServerDiff()) {

    private var selectedId: String = ""

    fun setSelected(id: String) {
        val old = currentList.indexOfFirst { it.id == selectedId }
        val new = currentList.indexOfFirst { it.id == id }
        selectedId = id
        if (old >= 0) notifyItemChanged(old)
        if (new >= 0) notifyItemChanged(new)
    }

    inner class ServerVH(view: View) : RecyclerView.ViewHolder(view) {
        val tvCode: TextView        = view.findViewById(R.id.tv_country_code)
        val tvName: TextView        = view.findViewById(R.id.tv_country_name)
        val tvDetail: TextView      = view.findViewById(R.id.tv_server_detail)
        val tvPing: TextView        = view.findViewById(R.id.tv_ping)
        val icPremium: ImageView    = view.findViewById(R.id.ic_premium)
        val icSelected: ImageView   = view.findViewById(R.id.ic_selected)
        val bar1: View              = view.findViewById(R.id.bar1)
        val bar2: View              = view.findViewById(R.id.bar2)
        val bar3: View              = view.findViewById(R.id.bar3)
        val bar4: View              = view.findViewById(R.id.bar4)
        val card: View              = view.findViewById(R.id.server_item_card)
        val avatarCard: com.google.android.material.card.MaterialCardView =
            view.findViewById(R.id.iv_country_avatar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ServerVH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_server, parent, false)
        return ServerVH(view)
    }

    override fun onBindViewHolder(holder: ServerVH, position: Int) {
        val server = getItem(position)
        val ctx = holder.itemView.context
        val isSelected = server.id == selectedId

        holder.tvCode.text = server.code
        holder.tvName.text = server.country
        holder.tvDetail.text = "${server.city} · بار سرور ${server.load}٪"

        // رنگ avatar
        val gradient = GradientDrawable(
            GradientDrawable.Orientation.TL_BR,
            intArrayOf(
                ContextCompat.getColor(ctx, server.gradientStartRes),
                ContextCompat.getColor(ctx, server.gradientEndRes),
            )
        )
        holder.tvCode.background = gradient

        // Premium
        holder.icPremium.visibility = if (server.isPremium) View.VISIBLE else View.GONE

        // انتخاب
        holder.icSelected.visibility = if (isSelected) View.VISIBLE else View.INVISIBLE

        // کارت border
        (holder.card as? com.google.android.material.card.MaterialCardView)?.let {
            it.strokeColor = if (isSelected)
                ContextCompat.getColor(ctx, R.color.fn_accent)
            else
                ContextCompat.getColor(ctx, R.color.fn_line)
            it.strokeWidth = if (isSelected) 2 else 1
        }

        // میله‌های پینگ
        val q = PingQuality.from(server.ping)
        val activeColor = when (q) {
            PingQuality.GOOD -> ContextCompat.getColor(ctx, R.color.fn_mint)
            PingQuality.MID  -> ContextCompat.getColor(ctx, R.color.fn_amber)
            PingQuality.BAD  -> ContextCompat.getColor(ctx, R.color.fn_rose)
        }
        val inactiveColor = ContextCompat.getColor(ctx, R.color.fn_line)
        val bars = when (q) {
            PingQuality.GOOD -> 4
            PingQuality.MID  -> 3
            PingQuality.BAD  -> 2
        }
        listOf(holder.bar1, holder.bar2, holder.bar3, holder.bar4).forEachIndexed { i, bar ->
            setBarColor(bar, ctx, if (i < bars) activeColor else inactiveColor)
        }

        // متن پینگ
        holder.tvPing.text = "${server.ping} ms"
        holder.tvPing.setTextColor(activeColor)

        // کلیک
        holder.itemView.setOnClickListener { onSelect(server) }
    }

    private fun setBarColor(view: View, ctx: Context, color: Int) {
        (view.background as? GradientDrawable)?.setColor(color)
            ?: view.setBackgroundColor(color)
    }

    // ════════════════════════════════════════════════════════════════════
    // DiffUtil
    // ════════════════════════════════════════════════════════════════════
    class ServerDiff : DiffUtil.ItemCallback<Server>() {
        override fun areItemsTheSame(old: Server, new: Server) = old.id == new.id
        override fun areContentsTheSame(old: Server, new: Server) = old == new
    }
}
