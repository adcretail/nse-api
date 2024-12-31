import psycopg2
from psycopg2 import sql
import streamlit as st
import pandas as pd

# Database connection parameters
db_params = {
    'dbname': 'stock_analytics',
    'user': 'root',
    'password': 'arka1256',
    'host': 'localhost',
    'port': '5432'
}

# SQL query to fetch filtered data
def get_filtered_stocks(cursor):
    """Retrieve filtered stock data with market_cap < 10000 and delivery_to_traded_quantity > 50."""
    query = """
    SELECT 
        ei.company_name,
        ei.symbol,
        ep.last_price AS last_traded_price,
        ti.trade_info_total_market_cap AS market_cap,
        em.pd_symbol_pe AS symbol_pe,
        sdp.delivery_to_traded_quantity,
        sp.promoter_and_promoter_group AS shareholding_pattern,
        fr.income AS latest_income,
        fr.expenditure AS latest_expenditure,
        fr.pro_loss_aft_tax AS latest_profit_loss
    FROM 
        equity_info ei
    LEFT JOIN equity_price_info ep ON ei.symbol = ep.symbol
    LEFT JOIN equity_metadata em ON ei.symbol = em.symbol
    LEFT JOIN security_wise_dp sdp ON ei.symbol = sdp.symbol
    LEFT JOIN trade_info ti ON ei.symbol = ti.symbol
    LEFT JOIN shareholdings_patterns sp ON ei.symbol = sp.symbol
    LEFT JOIN financial_results fr ON ei.symbol = fr.symbol
    WHERE 
        ti.trade_info_total_market_cap > 1000 AND ti.trade_info_total_market_cap < 10000 AND sdp.delivery_to_traded_quantity > 55 AND fr.pro_loss_aft_tax>1000
    ORDER BY 
        sdp.delivery_to_traded_quantity DESC;
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    return column_names, rows

# Streamlit UI (remains largely the same)
def main():
    st.title("📊 Filtered Stock Data Viewer")
    st.markdown("View filtered stock data with market cap < 10000 and delivery-to-traded quantity > 55, sorted in descending order.")

    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        column_names, rows = get_filtered_stocks(cursor)

        if rows:
            df = pd.DataFrame(rows, columns=column_names)
            st.dataframe(df)
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="Download Data as CSV",
                data=csv,
                file_name="filtered_stocks.csv",
                mime="text/csv"
            )
        else:
            st.warning("No data found matching the criteria.")

    except Exception as error:
        st.error(f"Error: {error}")

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()